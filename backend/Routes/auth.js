const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express')
const router = express.Router();
require('dotenv').config();
// DB
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
 
// SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 
// Middleware to protect routes
const routeGuard = require('../middleware/verifyToken');
 
// Welcome generator
const { generateWelcomeMessage } = require('./welcome');
 
// Frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
 
// -------------------- Register --------------------
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }
 
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password, verified) VALUES ($1, $2, $3, false) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    const newUser = result.rows[0];
 
    // Create verification token
    const verificationToken = jwt.sign(
      { id: newUser.id, type: "verify" },
      process.env.JWT_SECRET,
      { expiresIn: "60h" } // 60 hours
    );
 
    const activationLink = `${FRONTEND_URL}/user/verify/${verificationToken}`;
    console.log("🔗 Activation link generated:", activationLink);
 
    // Send verification email
    await sgMail.send({
      to: newUser.email,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Activate Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height:1.6; max-width:600px; margin:0 auto; padding:20px; background-color:#f0f0f0;">
          
          <!-- Box Container -->
          <div style="background-color:#ffffff; border-radius:12px; padding:30px; text-align:center; border:1px solid #e0e0e0;">
            
            // <!-- Logo Image -->
            // <img src="../uploads/v_logo.png" alt="Vibes Logo" style="max-width:150px; margin-bottom:30px;" />

            <!-- Welcome Text -->
            <h2 style="color:#333;">Welcome, ${newUser.username}!</h2>
            <p>Thank you for registering! Click the button below to activate your account and log in automatically.</p>

            <!-- Activation Button -->
            <div style="margin:30px 0;">
              <a href="${activationLink}" 
                style="display:inline-block; background:#5BC0EB; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">
                Activate My Account
              </a>
            </div>

            <!-- Fallback Link -->
            <p style="font-size:12px; color:#777;">
              If the button doesn’t work, copy and paste this link:<br>
              <code style="word-break:break-all;">${activationLink}</code>
            </p>

            <p style="font-size:12px; color:#777;">
              This link expires in 60 hours.
            </p>

          </div>

        </div>
      `
    });

 
    // ✅ Success response
    res.status(201).json({ 
      message: "✅ Registration successful! Please check your email to activate your account.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
 
  } catch (error) {
    console.error("❌ Error during registration:", error.message);
    if (error.code === '23505') {
      if (error.constraint?.includes('users_username_key')) {
        return res.status(409).json({ error: "Username already exists" });
      }

      if (error.constraint?.includes('users_email_key')) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }
    res.status(500).json({ error: "Server error during registration. Please try again." });
  }
});

// -------------------- Login --------------------
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
 
  try {
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
 
    if (!user.verified) {
      return res.status(401).json({ error: "Please verify your email before logging in" });
    }
 
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
 
    // Generate session token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "60d" } // 60 days
    );
 
    const welcomeMessage = await generateWelcomeMessage(username);
 
    // ✅ Login success
    res.json({
      success: true,
      token,
      welcomeMessage,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }

    });
 
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "Server error during login. Please try again." });
  }
});
 
// -------------------- Profile --------------------
router.get("/profile", routeGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, username, email, verified FROM users WHERE id = $1",
      [userId]
    );
 
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
 
    res.json({
      success: true,
      user: result.rows[0]
    });
 
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ error: "Server error while fetching profile." });
  }
});
 
module.exports = router;
 