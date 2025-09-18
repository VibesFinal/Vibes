const express = require("express");
const router = express.Router();
const pg = require("pg");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/communities?search=...&tag=...
router.get('/', async (req, res) => {
  try {
    const { search, tag } = req.query;
    let query = 'SELECT * FROM communities WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`, `%${search}%`);
      query += ` AND (name ILIKE $${params.length - 1} OR description ILIKE $${params.length})`;
    }

    if (tag) {
      params.push(tag);
      query += ` AND $${params.length} = ANY(tags)`;
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/communities/:id/join
router.patch('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the current state 
    const check = await pool.query("SELECT is_joined FROM communities WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Community not found" });
    }

    const newStatus = !check.rows[0].is_joined;
    const result = await pool.query(
      "UPDATE communities SET is_joined = $1 WHERE id = $2 RETURNING *",
      [newStatus, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update join status" });
  }
});

// POST /api/communities
router.post('/', async (req, res) => {
  try {
    const { name, description, icon, tags } = req.body;  // ✅ plural "tags"

    // Validate
    if (!name || !description || !icon || !tags) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO communities (name, description, icon, tags, member_count, is_joined)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, icon, JSON.stringify(tags), 1, true]
    );

    res.status(201).json(result.rows[0]);  // ✅ .json, not ,json
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create the community" });
  }
});

module.exports = router;  // 