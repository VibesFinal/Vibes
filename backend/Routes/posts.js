const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Create a new post
router.post("/", routeGuard, async (req, res) => {
    // Added 'is_anonymous' to the destructuring
    const { content, category, is_anonymous } = req.body;
    const user_id = req.user.id;

    if (!user_id || !content) {
        return res.status(400).send("user_id and content are required");
    }

    try {
        // Updated INSERT query to include 'is_anonymous'
        const insertResult = await pool.query(
            "INSERT INTO posts (user_id, content, category, is_anonymous) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, content, category, is_anonymous || false] // Pass the value, default to false
        );

        const postId = insertResult.rows[0].id;

        // Updated SELECT query to fetch 'is_anonymous'
        const fullPost = await pool.query(
            `SELECT posts.id, users.username, posts.content, posts.created_at, posts.category, posts.is_anonymous
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
    const { category } = req.query;

    try {
        // Updated SELECT query to fetch 'is_anonymous'
        let query = `
            SELECT posts.id, posts.user_id, users.username, posts.content, posts.created_at, posts.category, posts.is_anonymous
            FROM posts
            JOIN users ON posts.user_id = users.id
        `;
        const params = [];

        if (category) {
            query += " WHERE posts.category = $1";
            params.push(category);
        }

        query += " ORDER BY posts.created_at DESC";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("error fetching posts", error);
        res.status(500).send("server error");
    }
});

module.exports = router;
