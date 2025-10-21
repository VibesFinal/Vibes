const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const multer = require("multer");


const { uploadFile } = require("../middleware/uploadPostMedia"); //imagekit uploader importing

// Set storage for uploaded files 
const upload = multer({ storage: multer.memoryStorage() }); 

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Error messages
const { ERROR_MESSAGES } = require("../utils/errorMessages.js");

// Create a new post
router.post("/", routeGuard, upload.fields([{ name: "photo" } , { name: "video" }]) , async (req, res) => {
    // Added 'is_anonymous' to the destructuring
    const { content, category, is_anonymous } = req.body;
    const user_id = req.user.id;

    let photoUrl = null;
    let videoUrl = null;
    try {        
        if(req.files?.photo){
            photoUrl = await uploadFile(req.files.photo[0] , "/postPhotos"); //optional folder
        }

        if(req.files?.video){
            videoUrl = await uploadFile(req.files.video[0], "/postVideos"); // optional folder
        }

    } catch(error) {
        // return res.status(500).json({ error: "Failed to upload media" }); 
        console.error("❌ Media upload error:", error);
        return res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.MEDIA.UPLOAD_FAILED,
            type: "error",
        });         
    }

    // if (!user_id || !content) {
    //     return res.status(400).send("user_id and content are required");
    // }
    if (!user_id || !content) {
        return res.status(400).json({
            success: false,
            message: ERROR_MESSAGES.COMMENT.EMPTY_CONTENT || "User ID and content are required",
            type: "error",
        });
    }

    try {
        // Updated INSERT query to include 'is_anonymous'
        const insertResult = await pool.query(
            "INSERT INTO posts (user_id, content, category, is_anonymous , photo , video) VALUES ($1, $2, $3, $4 , $5 , $6) RETURNING *",
            [user_id, content, category, is_anonymous || false , photoUrl , videoUrl] // Pass the value, default to false
        );

        const postId = insertResult.rows[0].id;
        // Updated SELECT query to fetch 'is_anonymous' , photo and video
        const fullPost = await pool.query(
            `SELECT posts.id, posts.user_id ,users.username, users.profile_pic, users.is_therapist ,posts.content, posts.created_at, posts.category, posts.is_anonymous , posts.photo , posts.video
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = $1`,
            [postId]            
        );
        // res.status(201).json(fullPost.rows[0]);
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            type: "success",
            post: fullPost.rows[0],
        });

    } catch (error) {
        console.error("error creating a post", error);
        // res.status(500).send("server error");
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
            type: "error",
        });
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
        res.json(result.rows);
    } catch (error) {
        console.error("error fetching posts", error);
        // res.status(500).send("server error");
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
            type: "error",
        });
    }
});

// Edit a post
router.put("/:id", routeGuard, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content, category, is_anonymous } = req.body;

    // Validation
    // if (!content || content.trim() === '') {
    //     return res.status(400).json({ error: "Content cannot be empty" });
    // }
    if (!content || content.trim() === '') {
        return res.status(400).json({
            success: false,
            message: ERROR_MESSAGES.COMMENT.EMPTY_CONTENT,
            type: "error",
        });
    }
    try {
        // First, check if the post exists and belongs to the user
        const postCheck = await pool.query(
            "SELECT user_id FROM posts WHERE id = $1",
            [postId]
        );

        // if (postCheck.rows.length === 0) {
        //     return res.status(404).json({ error: "Post not found" });
        // }

        // if (postCheck.rows[0].user_id !== userId) {
        //     return res.status(403).json({ error: "You can only edit your own posts" });
        // }
        if (postCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: ERROR_MESSAGES.POST.NOT_FOUND,
                type: "error",
            });
        }

        if (postCheck.rows[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: ERROR_MESSAGES.POST.PERMISSION_DENIED,
                type: "error",
            });
        }

        // Update the post
        const updateResult = await pool.query(
            `UPDATE posts 
            SET content = $1, category = $2, is_anonymous = $3, edited_at = CURRENT_TIMESTAMP 
            WHERE id = $4 
            RETURNING *`,
            [content, category, is_anonymous, postId]
        );

        // Fetch the updated post with user information
        const updatedPost = await pool.query(
            `SELECT posts.id, posts.user_id, users.username, users.profile_pic, users.is_therapist ,posts.content, 
            posts.created_at, posts.edited_at, posts.category, posts.is_anonymous,posts.photo, posts.video
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = $1`,
            [postId]
        );
        // res.status(200).json(updatedPost.rows[0]);
        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            type: "success",
            post: updatedPost.rows[0],
        });

    } catch (error) {
        console.error("error editing post", error);
        // res.status(500).json({ error: "Server error while editing post" });
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
            type: "error",
        });
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

        // if (postCheck.rows.length === 0) {
        //     return res.status(404).json({ error: "Post not found" });
        // }

        // if (postCheck.rows[0].user_id !== userId) {
        //     return res.status(403).json({ error: "You can only delete your own posts" });
        // }
        if (postCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: ERROR_MESSAGES.POST.NOT_FOUND,
                type: "error",
            });
        }

        if (postCheck.rows[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts",
                type: "error",
            });
        }

        // Delete the post (CASCADE will handle related comments and likes)
        await pool.query("DELETE FROM posts WHERE id = $1", [postId]);

        // res.status(200).json({ 
        //     message: "Post deleted successfully", 
        //     deletedPostId: parseInt(postId) 
        // });
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            type: "success",
            deletedPostId: parseInt(postId),
        });

    } catch (error) {
        console.error("error deleting post", error);
        // res.status(500).json({ error: "Server error while deleting post" });
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.POST.DELETE_FAILED,
            type: "error",
        });
    }
});

module.exports = router;
