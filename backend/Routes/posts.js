const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const multer = require("multer");


const { uploadFile } = require("../middleware/uploadPostMedia"); //imagekit uploader importing

// Set storage for uploaded files 
const upload = multer({ storage: multer.memoryStorage() }); 

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Create a new post
router.post("/", routeGuard, upload.fields([{ name: "photo" } , { name: "video" }]) , async (req, res) => {

    const { content, category, is_anonymous } = req.body;
    const user_id = req.user.id;

    let photoUrl = null;
    let videoUrl = null;

    try {
        
        if(req.files?.photo){
            photoUrl = await uploadFile(req.files.photo[0] , "/postPhotos");
        }

        if(req.files?.video){
            videoUrl = await uploadFile(req.files.video[0], "/postVideos");
        }

    } catch (error) {
        return res.status(500).json({ error: "Failed to upload media" });
    }

    if (!user_id || !content) {
        return res.status(400).send("user_id and content are required");
    }

    try {

        const insertResult = await pool.query(
            "INSERT INTO posts (user_id, content, category, is_anonymous , photo , video) VALUES ($1, $2, $3, $4 , $5 , $6) RETURNING *",
            [user_id, content, category, is_anonymous || false , photoUrl , videoUrl]
        );

        const postId = insertResult.rows[0].id;

        const fullPost = await pool.query(
            `SELECT posts.id, posts.user_id ,users.username, users.profile_pic, users.is_therapist ,posts.content, posts.created_at, posts.category, posts.is_anonymous , posts.photo , posts.video
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = $1`,
            [postId]
        );

        // Fix URLs before sending response
        const post = fullPost.rows[0];
        
        if (post.profile_pic) {
            const trimmedPic = post.profile_pic.trim();
            if (trimmedPic && !trimmedPic.startsWith("http://") && !trimmedPic.startsWith("https://")) {
                post.profile_pic = `http://localhost:7777/uploads/${trimmedPic}`;
            }
        }

        res.status(201).json(post);
    } catch (error) {
        console.error("error creating a post", error);
        res.status(500).send("server error");
    }
});

// Get posts (optionally filter by category)
router.get("/", async (req, res) => {

    const { category , limit = 7 , offset = 0 } = req.query;  //default 7 posts per request

    try {
        // Updated SELECT query to fetch 'is_anonymous'
        let query = `
            SELECT posts.id, posts.user_id, users.username, users.profile_pic, users.is_therapist ,posts.content, posts.created_at, posts.category, posts.is_anonymous , 
            posts.photo , posts.video
            FROM posts
            JOIN users ON posts.user_id = users.id
        `;
        const params = [];

        if (category) {
            query += " WHERE posts.category = $1";
            params.push(category);
        }

        query += ` ORDER BY posts.created_at DESC, posts.id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

        params.push(limit);
        params.push(offset);

        const result = await pool.query(query, params);
        
        // Fix URLs for profile_pic, photo, and video
        const posts = result.rows.map((post) => {
            // Fix profile_pic URL
            if (post.profile_pic) {
                const trimmedPic = post.profile_pic.trim();
                if (trimmedPic && !trimmedPic.startsWith("http://") && !trimmedPic.startsWith("https://")) {
                    post.profile_pic = `http://localhost:7777/uploads/${trimmedPic}`;
                } else if (!trimmedPic) {
                    post.profile_pic = null;
                }
            }

            // Fix photo URL
            if (post.photo) {
                const trimmedPhoto = post.photo.trim();
                if (trimmedPhoto && !trimmedPhoto.startsWith("http://") && !trimmedPhoto.startsWith("https://")) {
                    post.photo = `http://localhost:7777/uploads/${trimmedPhoto}`;
                } else if (!trimmedPhoto) {
                    post.photo = null;
                }
            }

            // Fix video URL
            if (post.video) {
                const trimmedVideo = post.video.trim();
                if (trimmedVideo && !trimmedVideo.startsWith("http://") && !trimmedVideo.startsWith("https://")) {
                    post.video = `http://localhost:7777/uploads/${trimmedVideo}`;
                } else if (!trimmedVideo) {
                    post.video = null;
                }
            }

            return post;
        });

        res.json(posts);
    } catch (error) {
        console.error("error fetching posts", error);
        res.status(500).send("server error");
    }
});

// Edit a post
router.put("/:id", routeGuard, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content, category, is_anonymous } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ error: "Content cannot be empty" });
    }

    try {
        const postCheck = await pool.query(
            "SELECT user_id FROM posts WHERE id = $1",
            [postId]
        );

        if (postCheck.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (postCheck.rows[0].user_id !== userId) {
            return res.status(403).json({ error: "You can only edit your own posts" });
        }

        const updateResult = await pool.query(
            `UPDATE posts 
            SET content = $1, category = $2, is_anonymous = $3, edited_at = CURRENT_TIMESTAMP 
            WHERE id = $4 
             RETURNING *`,
            [content, category, is_anonymous, postId]
        );

        const updatedPost = await pool.query(
            `SELECT posts.id, posts.user_id, users.username, users.profile_pic, users.is_therapist ,posts.content, 
                    posts.created_at, posts.edited_at, posts.category, posts.is_anonymous, 
                    posts.photo, posts.video
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = $1`,
            [postId]
        );

        // Fix URLs before sending response
        const post = updatedPost.rows[0];
        
        if (post.profile_pic) {
            const trimmedPic = post.profile_pic.trim();
            if (trimmedPic && !trimmedPic.startsWith("http://") && !trimmedPic.startsWith("https://")) {
                post.profile_pic = `http://localhost:7777/uploads/${trimmedPic}`;
            }
        }

        if (post.photo) {
            const trimmedPhoto = post.photo.trim();
            if (trimmedPhoto && !trimmedPhoto.startsWith("http://") && !trimmedPhoto.startsWith("https://")) {
                post.photo = `http://localhost:7777/uploads/${trimmedPhoto}`;
            }
        }

        if (post.video) {
            const trimmedVideo = post.video.trim();
            if (trimmedVideo && !trimmedVideo.startsWith("http://") && !trimmedVideo.startsWith("https://")) {
                post.video = `http://localhost:7777/uploads/${trimmedVideo}`;
            }
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("error editing post", error);
        res.status(500).json({ error: "Server error while editing post" });
    }
});

// Delete a post
router.delete("/:id", routeGuard, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        // First, check if the post exists and belongs to the user
        const postCheck = await pool.query(
            "SELECT user_id FROM posts WHERE id = $1",
            [postId]
        );

        if (postCheck.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (postCheck.rows[0].user_id !== userId) {
            return res.status(403).json({ error: "You can only delete your own posts" });
        }

        // Delete the post (CASCADE will handle related comments and likes)
        await pool.query("DELETE FROM posts WHERE id = $1", [postId]);

        res.status(200).json({ 
            message: "Post deleted successfully", 
            deletedPostId: parseInt(postId) 
        });
    } catch (error) {
        console.error("error deleting post", error);
        res.status(500).json({ error: "Server error while deleting post" });
    }
});

module.exports = router;
