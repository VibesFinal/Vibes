// 
const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.get('/communities/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
         m.id,
         m.community_id,
         m.user_id,
         m.content AS message,
         m.created_at AS timestamp,
         m.is_deleted,
         m.edited_at,
         u.username AS senderName
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.community_id = $1 AND m.is_deleted = false
       ORDER BY m.created_at ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

module.exports = router;