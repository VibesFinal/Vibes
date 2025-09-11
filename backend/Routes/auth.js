const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const routeGuard = require('../middleware/verifyToken');
require('dotenv').config();

// DB
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ✅ Import Gemini welcome message generator
const { generateWelcomeMessage } = require('./welcome'); // ← ADD THIS

// Register (unchanged)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("username, email, password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting user", error.message);
    if (error.code === '23505') {
      res.status(409).send("Username already exists");
    } else if (error.detail?.includes("email")) {
      res.status(409).send("Email already exists");
    } else {
      res.status(500).send("Server error: " + error.message);
    }
  }
});

// ✅ Enhanced Login — Now returns token + Gemini welcome message
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).send("Invalid credentials");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "60d" }
    );

    // ✅ Generate AI welcome message
    const welcomeMessage = await generateWelcomeMessage(username);

    // ✅ Send both token and message
    res.json({
      token,
      welcomeMessage,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).send("Server error: " + error.message);
  }
});

// Profile (unchanged)
router.get("/profile", routeGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT username, email FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log("Error fetching profile", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;