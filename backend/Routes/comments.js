// routes/comments.js
const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ✅ Helper to send notification (same as in likes.js and follows.js)
async function sendNotification({ userId, message, type, referenceId, io }) {
  try {
    const notif = await pool.query(
      `INSERT INTO notifications (user_id, message, is_read, type, reference_id)
       VALUES ($1, $2, false, $3, $4) RETURNING *`,
      [userId, message, type, referenceId]
    );

    if (io?.emitNotification) {
      io.emitNotification(userId, notif.rows[0]);
    }
  } catch (err) {
    console.error('❌ Notification failed:', err);
  }
}

// Add a comment
router.post("/:postId", routeGuard, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    // 1. Save comment
    const result = await pool.query(
      "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *",
      [userId, postId, content]
    );

    // 2. ✅ GET POST OWNER
    const post = await pool.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [postId]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const ownerId = post.rows[0].user_id;

    // 3. ✅ DON'T NOTIFY YOURSELF
    if (ownerId === userId) {
      return res.status(200).json(result.rows[0]);
    }

    // 4. ✅ SEND NOTIFICATION
    const commenter = await pool.query(
      'SELECT username FROM users WHERE id = $1',
      [userId]
    );
    const commenterName = commenter.rows[0]?.username || 'Someone';
    const message = `${commenterName} commented on your post!`;

    sendNotification({
      userId: ownerId,
      message,
      type: 'post_commented',
      referenceId: postId,
      io: req.io
    });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("error adding comment", error);
    res.status(500).json({ error: "failed to add a comment" });
  }
});

// Get all comments for a post (no change)
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT comments.*, users.username
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE post_id = $1
        ORDER BY created_at ASC
      `,
      [postId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("error fetching comments", error);
    res.status(500).json({ error: "failed to fetch comments" });
  }
});

module.exports = router;