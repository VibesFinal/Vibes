const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const ImageKit = require("imagekit");
const multer = require("multer");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Error messages
const { ERROR_MESSAGES } = require("../utils/errorMessages.js");

const upload = multer({ storage: multer.memoryStorage() });

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// NEW: Upload during registration (no auth required)
router.post("/upload-registration", upload.single("certification"), async (req, res) => {
  try {
    const { username } = req.body;    
    // if (!username) {
    //   return res.status(400).json({ error: "Username is required" });
    // }
    
    // if (!req.file) {
    //   return res.status(400).json({ error: "Certification file is required" });
    // }
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.USER.INVALID_ID, 
        type: "error",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.MEDIA.UPLOAD_CERTIFI,
        type: "error",
      });
    }

    // Get user ID from username
    const userResult = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    
    // if (!userResult.rows[0]) {
    //   return res.status(404).json({ error: "User not found" });
    // }
    if (!userResult.rows[0]) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER.NOT_FOUND,
        type: "error",
      });
    }    
    const userId = userResult.rows[0].id;
    
    const uploadResponse = await imageKit.upload({
      file: req.file.buffer.toString("base64"), // convert buffer to base64
      fileName: `${username}_certification.pdf`, // or whatever the uploaded file is
      folder: `/certifications/user_${userId}`,
    });
    
    await pool.query(
      "INSERT INTO therapist_certifications (user_id, file_path, status) VALUES ($1, $2, $3)",
      [userId, uploadResponse.url, "pending"]
    );
    
    // res.json({ message: "Certification uploaded, pending approval." });
    res.json({
      success: true,
      message: "Certification uploaded, pending approval.",
      type: "success",
    });

  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: "Server error" });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
      type: "error",
    });
  }
});

// FIXED: Original upload route (for authenticated users)
router.post("/upload", routeGuard, upload.single("certification"), async (req, res) => {
  try {
    const userId = req.user.id; // Fixed: was req.user.userId    
    // if (!req.file) {
    //   return res.status(400).json({ error: "Certification file is required" });
    // }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.MEDIA.UPLOAD_CERTIFI,
        type: "error",
      });
    }
    
    // Upload to ImageKit
    const uploadResponse = await imageKit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `user_${userId}_certification.pdf`,
      folder: `/certifications/user_${userId}`,
    });
    
    await pool.query(
      "INSERT INTO therapist_certifications (user_id, file_path, status) VALUES ($1, $2, $3)",
      [userId, uploadResponse.url, "pending"]
    );
    
    // res.json({ message: "Certification uploaded, pending approval." });
    res.json({
      success: true,
      message: "Certification uploaded, pending approval.",
      type: "success",
    });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: "Server error" });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
      type: "error",
    });
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
    // res.status(500).json({ error: 'Failed to load therapists' });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.USER.FETCH_FAILED || "Failed to load therapists",
      type: "error",
    });
  }
});

// GET chat/conversations
router.get('/chat/conversations', routeGuard, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT pc.id,
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
    // res.status(500).json({ error: 'Failed to load conversations' });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.MEDIA.UPLOAD_FAILED_CERTIFI,
      type: "error",
    });
  }
});

module.exports = router;