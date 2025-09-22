const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const multer = require("multer");
const path = require("path");

// Set storage for uploaded files
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");

  },

  filename: (req, file, cb) => {

    cb(null, Date.now() + path.extname(file.originalname)); // unique filename

  }

});

const upload = multer({ storage });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Create a new post
router.post("/", routeGuard, upload.fields([{ name: "photo" } , { name: "video" }]) , async (req, res) => {

    // Added 'is_anonymous' to the destructuring
    const { content, category, is_anonymous } = req.body;
    const user_id = req.user.id;

    //file paths if uploaded (ternary operators)
    const photo = req.files?.photo ? req.files.photo[0].filename : null;
    const video = req.files?.video ? req.files.video[0].filename : null;

    if (!user_id || !content) {

        return res.status(400).send("user_id and content are required");

    }

    try {
        // Updated INSERT query to include 'is_anonymous'
        const insertResult = await pool.query(

            "INSERT INTO posts (user_id, content, category, is_anonymous , photo , video) VALUES ($1, $2, $3, $4 , $5 , $6) RETURNING *",
            [user_id, content, category, is_anonymous || false , photo , video] // Pass the value, default to false

        );

        const postId = insertResult.rows[0].id;

        // Updated SELECT query to fetch 'is_anonymous' , photo and video
        const fullPost = await pool.query(

            `SELECT posts.id, users.username, posts.content, posts.created_at, posts.category, posts.is_anonymous , posts.photo , posts.video
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = $1`,
            [postId]
            
        );

        res.status(201).json(fullPost.rows[0]);
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
            SELECT posts.id, posts.user_id, users.username, posts.content, posts.created_at, posts.category, posts.is_anonymous , 
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
        res.status(500).send("server error");
    }
});

module.exports = router;
