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

module.exports = router;