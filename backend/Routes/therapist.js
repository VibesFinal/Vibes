const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const multer = require("multer");
const path = require("path");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/certifications"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ✅ NEW: Upload during registration (no auth required)
router.post("/upload-registration", upload.single("certification"), async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "Certification file is required" });
    }
    
    // Get user ID from username
    const userResult = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    
    if (!userResult.rows[0]) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const userId = userResult.rows[0].id;
    const filePath = "/uploads/certifications/" + req.file.filename;
    
    await pool.query(
      "INSERT INTO therapist_certifications (user_id, file_path, status) VALUES ($1, $2, $3)",
      [userId, filePath, "pending"]
    );
    
    res.json({ message: "Certification uploaded, pending approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ FIXED: Original upload route (for authenticated users)
router.post("/upload", routeGuard, upload.single("certification"), async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Fixed: was req.user.userId
    
    if (!req.file) {
      return res.status(400).json({ error: "Certification file is required" });
    }
    
    const filePath = "/uploads/certifications/" + req.file.filename;
    
    await pool.query(
      "INSERT INTO therapist_certifications (user_id, file_path, status) VALUES ($1, $2, $3)",
      [userId, filePath, "pending"]
    );
    
    res.json({ message: "Certification uploaded, pending approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/therapists
router.get('/therapists', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, email, profile_pic
      FROM users
      WHERE is_therapist = true AND verified = true
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load therapists' });
  }
});

// GET chat/conversations
router.get('/chat/conversations', routeGuard, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        pc.id,
        CASE WHEN pc.user_id = $1 THEN u2.id ELSE u1.id END AS other_user_id,
        CASE WHEN pc.user_id = $1 THEN u2.username ELSE u1.username END AS other_user_username,
        CASE WHEN pc.user_id = $1 THEN u2.is_therapist ELSE u1.is_therapist END AS other_user_is_therapist,
        pm.content,
        pm.created_at
      FROM private_conversations pc
      JOIN users u1 ON pc.user_id = u1.id
      JOIN users u2 ON pc.therapist_id = u2.id
      LEFT JOIN (
        SELECT DISTINCT ON (conversation_id) *
        FROM private_messages
        ORDER BY conversation_id, created_at DESC
      ) pm ON pm.conversation_id = pc.id
      WHERE pc.user_id = $1 OR pc.therapist_id = $1
      ORDER BY pm.created_at DESC NULLS LAST;
      `,
      [userId]
    );

    const conversations = result.rows.map(row => ({
      id: row.id,
      other_user: {
        id: row.other_user_id,
        username: row.other_user_username,
        is_therapist: row.other_user_is_therapist
      },
      last_message: row.content
        ? { content: row.content }
        : null
    }));

    res.json(conversations);
  } catch (err) {
    console.error('Fetch conversations error:', err);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

module.exports = router;