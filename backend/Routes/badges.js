// routes/badges.js
const express = require('express');
const router = express.Router();
const pg = require('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

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
    res.status(500).json({ error: 'Server error' });
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
  try {
    // 🏅 Supportive Soul
    const ssResult = await pool.query(`
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_id, (SELECT id FROM badge_types WHERE name='Supportive Soul')
      FROM comments
      GROUP BY user_id
      HAVING COUNT(*) >= 20
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING *;
    `);

    // 🏅 Story Teller
    const stResult = await pool.query(`
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_id, (SELECT id FROM badge_types WHERE name='Story Teller')
      FROM posts
      GROUP BY user_id
      HAVING COUNT(*) >= 10
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING *;
    `);

    // 🏅 Cheerleader
    const chResult = await pool.query(`
      INSERT INTO user_badges (user_id, badge_id)
      SELECT l.user_id, (SELECT id FROM badge_types WHERE name='Cheerleader')
      FROM likes l
      GROUP BY l.user_id
      HAVING COUNT(*) >= 20
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING *;
    `);

    // 🏅 Popular
    const popResult = await pool.query(`
      INSERT INTO user_badges (user_id, badge_id)
      SELECT p.user_id, (SELECT id FROM badge_types WHERE name='Popular')
      FROM posts p
      JOIN comments c ON c.post_id = p.id
      GROUP BY p.user_id
      HAVING COUNT(c.id) >= 50
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING *;
    `);

    res.json({
      message: 'Badges awarded successfully',
      supportSoulAdded: ssResult.rowCount,
      storyTellerAdded: stResult.rowCount,
      cheerleaderAdded: chResult.rowCount,
      popularAdded: popResult.rowCount
    });
  } catch (err) {
    console.error("Error awarding badges:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
