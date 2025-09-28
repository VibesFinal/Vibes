// routes/follows.js
const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ✅ Helper to send notification (same as in likes.js)
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

// 🟢 Follow a user
router.post("/:userId", routeGuard, async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.userId);

  if (isNaN(followingId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (followerId === followingId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  try {
    // 1. Save follow
    const result = await pool.query(
      "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
      [followerId, followingId]
    );

    // If no row returned, it means the follow already existed → no notification
    if (result.rows.length === 0) {
      return res.json({ message: "Already following" });
    }

    // 2. ✅ SEND NOTIFICATION TO FOLLOWED USER
    const follower = await pool.query(
      'SELECT username FROM users WHERE id = $1',
      [followerId]
    );
    const followerName = follower.rows[0]?.username || 'Someone';
    const message = `${followerName} started following you!`;

    sendNotification({
      userId: followingId,        // 👈 notify the person being followed
      message,
      type: 'user_followed',
      referenceId: followerId,    // so you can view their profile
      io: req.io
    });

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔴 Unfollow (no notification needed)
router.delete("/:userId", routeGuard, async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.userId);

  try {
    await pool.query(
      "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );
    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👥 Get followers (no change)
router.get("/:userId/followers", routeGuard, async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ➡️ Get following (no change)
router.get("/:userId/following", routeGuard, async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email
       FROM follows f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;