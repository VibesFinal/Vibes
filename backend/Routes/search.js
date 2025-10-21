const express = require("express");
const router = express.Router();
const pg = require("pg");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Error messages
const { ERROR_MESSAGES } = require("../utils/errorMessages.js");

// GET /user/search?username=...
router.get("/", async (req, res) => {
  const searchTerm = req.query.username;

  // if (!searchTerm) {
  //   return res.status(400).json({ message: "Username query is required" });
  // }
  if (!searchTerm) {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.SEARCH.QUERY_EMPTY,
      type: "error",
    });
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
    // res.status(500).json({ message: "Server error" });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
      type: "error",
    });
  }
});

module.exports = router;
