// src/routes/chathistory.js
const express = require('express');
const router = express.Router();
const pg = require('pg');
//const routeGuard = require('../middleware/verifyToken'); // ← only imported, not used yet

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Error messages
const { ERROR_MESSAGES } = require("../utils/errorMessages.js");

// Public route (no auth needed to read messages)
router.get('/communities/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure id is a number to prevent SQL injection
    // if (isNaN(id)) {
    //   return res.status(400).json({ error: 'Invalid community ID' });
    // }
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.COMMUNITY.JOIN_FAILED,
        type: "error",
      });
    }

    const result = await pool.query(
      `SELECT 
         m.id,
         m.community_id,
         m.user_id,
         m.content AS message,
         m.created_at AS timestamp,
         m.is_deleted,
         m.edited_at,
         u.username AS sender_name   
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.community_id = $1 AND m.is_deleted = false
       ORDER BY m.created_at ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    // res.status(500).json({ error: 'Failed to load messages' });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.CHAT.MESSAGE_NOT_FOUND,
      type: "error",
    });
  }
});

module.exports = router;