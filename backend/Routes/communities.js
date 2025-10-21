const express = require("express");
const router = express.Router();
const pg = require("pg");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Error messages
const { ERROR_MESSAGES } = require("../utils/errorMessages.js");

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
      query += ` AND $${params.length} IN (SELECT jsonb_array_elements_text(tags::jsonb))`;
    }

    const result = await pool.query(query, params);
    // res.status(200).json(result.rows);
    res.json({
      success: true,
      communities: result.rows
    });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: "Internal server error" });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR || "Internal server error",
      type: "error",
    });
  }
});

// PATCH /api/communities/:id/join
router.patch('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the current state 
    const check = await pool.query("SELECT is_joined FROM communities WHERE id = $1", [id]);
    // if (check.rows.length === 0) {
    //   return res.status(404).json({ error: "Community not found" });
    // }
    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.COMMUNITY.NOT_FOUND ,
        type: "error",
      });
    }

    const newStatus = !check.rows[0].is_joined;
    const result = await pool.query(
      "UPDATE communities SET is_joined = $1 WHERE id = $2 RETURNING *",
      [newStatus, id]
    );

    // res.status(200).json(result.rows[0]);
    res.status(200).json({
      success: true,
      message: `Community ${newStatus ? "joined" : "left"} successfully`,
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: "Failed to update join status" });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.COMMUNITY.JOIN_FAILED,
      type: "error",
    });
  }
});

// POST /api/communities
router.post('/', async (req, res) => {
  try {
    const { name, description, icon, tags } = req.body;  // ✅ plural "tags"

    // Validate
    // if (!name || !description || !icon || !tags) {
    //   return res.status(400).json({ error: "Missing required fields" });
    // }
    if (!name || !description || !icon || !tags) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.COMMUNITY.MISSING_FIELDS || "Missing required fields",
        type: "error",
      });
    }

    const result = await pool.query(
      `INSERT INTO communities (name, description, icon, tags, member_count, is_joined)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, icon, JSON.stringify(tags), 1, true]
    );

    // res.status(201).json(result.rows[0]);  // ✅ .json, not ,json
    res.status(201).json({
      success: true,
      message: ERROR_MESSAGES.COMMUNITY.CREATE_COMMUNITY,
      community: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: "Failed to create the community" });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.COMMUNITY.CREATE_FAILED || "Failed to create the community",
      type: "error",
    });
  }
});

module.exports = router;  // 