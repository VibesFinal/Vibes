const express = require("express");
const router = express.Router();
const pg = require("pg");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// GET /user/search?username=...
router.get("/", async (req, res) => {
  const searchTerm = req.query.username;

  if (!searchTerm) {
    return res.status(400).json({ message: "Username query is required" });
  }

  try {
    const result = await pool.query(
      `SELECT id, username 
       FROM users 
       WHERE username ILIKE $1
       LIMIT 10`,
      [`%${searchTerm}%`]
    );

    res.json({ users: result.rows });
  } catch (err) {
    console.error("Search query failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
