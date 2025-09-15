const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });


// 🟢 Follow a user
router.post("/:userId",routeGuard, async (req, res) => {
  const followerId = req.user.id; // Current logged-in user (from auth middleware)
  const followingId = parseInt(req.params.userId);

  if (followerId === followingId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  try {
    await pool.query(
      "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [followerId, followingId]
    );

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔴 Unfollow a user
router.delete("/:userId",routeGuard, async (req, res) => {
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

// 👥 Get all followers of a user
router.get("/:userId/followers",routeGuard, async (req, res) => {
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

// ➡️ Get all users that a user is following
router.get("/:userId/following",routeGuard, async (req, res) => {
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