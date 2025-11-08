// routes/badges.js
const express = require('express');
const router = express.Router();
const pg = require('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Error messages
const { ERROR_MESSAGES } = require("../utils/errorMessages.js");

/**
 * GET /badges/:userId
 * Fetch all badges awarded to a specific user.
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT b.id, b.name, b.description, b.image_url, ub.awarded_at
      FROM user_badges ub
      JOIN badge_types b ON b.id = ub.badge_id
      WHERE ub.user_id = $1
      ORDER BY ub.awarded_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching badges:", err);
    // res.status(500).json({ error: 'Server error' });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
      type: "error",
    });
  }
});

/**
 * POST /badges/award/all
 * Award all badges to eligible users:
 * - Supportive Soul (20+ comments)
 * - Story Teller (10+ posts)
 * - Cheerleader (20+ likes)
 * - Popular (50+ comments on posts)
 */
router.post('/award/all', async (req, res) => {
  const results = {
    supportSoulAdded: 0,
    storyTellerAdded: 0,
    cheerleaderAdded: 0,
    popularAdded: 0,
    errors: []
  };

  try {
    // Supportive Soul
    try {
      const ssResult = await pool.query(`
        INSERT INTO user_badges (user_id, badge_id)
        SELECT user_id, 1
        FROM comments
        GROUP BY user_id
        HAVING COUNT(*) >= 20
        ON CONFLICT (user_id, badge_id) DO NOTHING
        RETURNING *;
      `);
      results.supportSoulAdded = ssResult.rowCount;
    } catch (err) {
      results.errors.push({ badge: 'Supportive Soul', error: err.message });
    }

    // Story Teller
    try {
      const stResult = await pool.query(`
        INSERT INTO user_badges (user_id, badge_id)
        SELECT user_id, 2
        FROM posts
        GROUP BY user_id
        HAVING COUNT(*) >= 10
        ON CONFLICT (user_id, badge_id) DO NOTHING
        RETURNING *;
      `);
      results.storyTellerAdded = stResult.rowCount;
    } catch (err) {
      results.errors.push({ badge: 'Story Teller', error: err.message });
    }

    // Cheerleader
    try {
      const chResult = await pool.query(`
        INSERT INTO user_badges (user_id, badge_id)
        SELECT user_id, 3
        FROM likes
        GROUP BY user_id
        HAVING COUNT(*) >= 20
        ON CONFLICT (user_id, badge_id) DO NOTHING
        RETURNING *;
      `);
      results.cheerleaderAdded = chResult.rowCount;
    } catch (err) {
      results.errors.push({ badge: 'Cheerleader', error: err.message });
    }

    // Popular
    try {
      const popResult = await pool.query(`
        INSERT INTO user_badges (user_id, badge_id)
        SELECT p.user_id, 4
        FROM posts p
        JOIN comments c ON c.post_id = p.id
        GROUP BY p.user_id
        HAVING COUNT(c.id) >= 50
        ON CONFLICT (user_id, badge_id) DO NOTHING
        RETURNING *;
      `);
      results.popularAdded = popResult.rowCount;
    } catch (err) {
      results.errors.push({ badge: 'Popular', error: err.message });
    }

    res.json({
      success: results.errors.length === 0,
      message: results.errors.length === 0
        ? "Badges awarded successfully."
        : "Some badges could not be awarded.",
      type: results.errors.length === 0 ? "success" : "warning",
      data: results
    });

  } catch (err) {
    console.error("Error awarding badges:", err);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
      type: "error",
    });
  }
});

module.exports = router;
