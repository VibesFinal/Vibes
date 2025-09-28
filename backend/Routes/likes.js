const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ✅ Helper to send notification
async function sendNotification({ userId, message, type, referenceId, io }) {
  try {
    // Save to DB
    const notif = await pool.query(
      `INSERT INTO notifications (user_id, message, is_read, type, reference_id)
       VALUES ($1, $2, false, $3, $4) RETURNING *`,
      [userId, message, type, referenceId]
    );

    // 🔍 ADD LOGS HERE TO DEBUG
    console.log('📤 About to emit notification via io.emitNotification');
    console.log('   → Target userId:', userId);
    console.log('   → Notification:', notif.rows[0]);

    // Emit via Socket.IO
    if (io?.emitNotification) {
      io.emitNotification(userId, notif.rows[0]);
      console.log('✅ Successfully called io.emitNotification');
    } else {
      console.warn('⚠️ io.emitNotification is not available!');
    }
  } catch (err) {
    console.error('❌ Notification failed:', err);
  }
}

// Like a post
router.post("/like/:postId", routeGuard, async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { reaction_type } = req.body;

  try {
    // 1. Save the like (your existing logic)
    await pool.query(
      `INSERT INTO likes (user_id, post_id, reaction_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, post_id) DO UPDATE SET reaction_type = EXCLUDED.reaction_type`,
      [userId, postId, reaction_type || 'like']
    );

    // 2. ✅ GET POST OWNER
    const postResult = await pool.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const ownerId = postResult.rows[0].user_id;

    // 3. ✅ DON'T NOTIFY YOURSELF
    if (ownerId === userId) {
      return res.status(200).json({ message: "Reaction added" });
    }

    // 4. ✅ SEND NOTIFICATION
    const likerResult = await pool.query(
      'SELECT username FROM users WHERE id = $1',
      [userId]
    );
    const likerName = likerResult.rows[0]?.username || 'Someone';
    const reaction = reaction_type || 'like';

    // Customize message based on reaction
    let message;
    if (reaction === 'like') {
      message = `${likerName} liked your post! 👍`;
    } else if (reaction === 'love') {
      message = `${likerName} loved your post! ❤️`;
    } else if (reaction === 'hug') {
      message = `${likerName} sent a hug to your post! 🤗`;
    } else {
      message = `${likerName} reacted to your post with "${reaction}"!`;
    }

    sendNotification({
      userId: ownerId,
      message,
      type: 'post_liked',
      referenceId: postId,
      io: req.io // 👈 we'll attach io in server.js
    });

    res.status(200).json({ message: "Reaction added" });
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

// Unlike a post (no notification needed)
router.delete("/like/:postId", routeGuard, async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    await pool.query(
      "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );
    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

// Get likes count (no change)
router.get("/like/count/:postId", routeGuard, async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );
    res.status(200).json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

// Get like status (no change)
router.get("/like/:postId", routeGuard, async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const result = await pool.query(
      "SELECT reaction_type FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    const likedByUser = result.rows.length > 0;
    const reaction_type = likedByUser ? result.rows[0].reaction_type : null;

    const countResult = await pool.query(
      "SELECT reaction_type, COUNT(*) FROM likes WHERE post_id = $1 GROUP BY reaction_type",
      [postId]
    );

    const counts = {};
    countResult.rows.forEach(r => {
      counts[r.reaction_type] = parseInt(r.count);
    });

    res.status(200).json({ 
      likedByUser, 
      reactionType: reaction_type, 
      counts 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;