const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Create a new post
router.post("/", routeGuard, async (req, res) => {
    const { content, category } = req.body;
    const user_id = req.user.id;

    if (!user_id || !content) {
        return res.status(400).send("user_id and content are required");
    }

    try {
        const insertResult = await pool.query(
            "INSERT INTO posts (user_id, content, category) VALUES ($1, $2, $3) RETURNING *",
            [user_id, content, category]
        );

        const postId = insertResult.rows[0].id;

        // Fetch the full post
        const fullPost = await pool.query(
            `SELECT posts.id, users.username, posts.content, posts.created_at, posts.category
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
        let query = `
            SELECT posts.id, users.username, posts.content, posts.created_at, posts.category
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
