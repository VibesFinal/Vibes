const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
require('dotenv').config();

// Node built-in crypto
const crypto = require('crypto');

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
      "INSERT INTO users (username, email, password, verified) VALUES ($1, $2, $3, false) RETURNING id, username, email, role, is_therapist",
      [username, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Create verification token
    const verificationToken = jwt.sign(
      { id: newUser.id, type: "verify" },
      process.env.JWT_SECRET,
      { expiresIn: "60h" }
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
          <div style="background-color:#ffffff; border-radius:12px; padding:30px; text-align:center; border:1px solid #e0e0e0;">
            
            <!-- Logo Image -->
            <!--<img src="https://i.postimg.cc/N0Dy4zgS/v-logo.png" 
                alt="V Logo" 
                style="width:120px; height:auto; margin-bottom:20px;" />-->

            <h2 style="color:#333;">Welcome, ${newUser.username}!</h2>
            <p>Thank you for registering! Click the button below to activate your account.</p>
            
            <div style="margin:30px 0;">
              <a href="${activationLink}" 
                style="display:inline-block; background:#5BC0EB; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">
                Activate My Account
              </a>
            </div>

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
        email: newUser.email,
        role: newUser.role,
        is_therapist: newUser.is_therapist, 
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
    const userResult = await pool.query("SELECT id, username, email, password, verified, role, is_therapist FROM users WHERE username = $1",
      
      [username]);

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
      { id: user.id, username: user.username , role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "60d" }
    );

    const welcomeMessage = await generateWelcomeMessage(username);

    res.json({
      success: true,
      token,
      welcomeMessage,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_therapist: user.is_therapist, 
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
      "SELECT id, username, email, verified, is_therapist ,profile_pic , role FROM users WHERE id = $1", 
      [userId]  //get back here
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


// -------------------- Forgot Password --------------------
router.post("/forgot-password", async (req, res) => {
  // Trim and lowercase the email to avoid mismatch issues
  const email = (req.body.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "1Email is required" });
  console.log("Received email:", email);
  if (!email) return res.status(400).json({ error: "2Email is required" });

  try {
    
    // Debug: log the received email
    console.log("Received email:", email);

    // Case-insensitive search in the database
    const userResult = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = $1",
      [email]
    );
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ error: "No account with this email" });

    // Generate a reset token valid for 1 hour
    const resetToken = jwt.sign(
      { id: user.id, type: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store the token temporarily in the database
    await pool.query("UPDATE users SET reset_token = $1 WHERE id = $2", [resetToken, user.id]);

    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    // Send the reset email
    await sgMail.send({
      to: user.email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height:1.6; max-width:600px; margin:0 auto; padding:20px; background-color:#f0f0f0;">
          <div style="background-color:#ffffff; border-radius:12px; padding:30px; text-align:center; border:1px solid #e0e0e0;">
            
            <!-- Logo Image -->
            <!--<img src="https://i.postimg.cc/N0Dy4zgS/v-logo.png" 
                alt="V Logo" 
                style="width:120px; height:auto; margin-bottom:20px;" />-->

            <h2 style="color:#333;">Hello ${user.username},</h2>
            <p>You requested a password reset. Click the button below to set a new password.</p>
            
            <div style="margin:30px 0;">
              <a href="${resetLink}" 
                style="display:inline-block; background:#5BC0EB; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">
                Reset Password
              </a>
            </div>

            <p style="font-size:12px; color:#777;">
              If the button doesn’t work, copy and paste this link:<br>
              <code style="word-break:break-all;">${resetLink}</code>
            </p>

            <p style="font-size:12px; color:#777;">
              This link will expire in 1 hour.
            </p>
          </div>
        </div>
      `
    });


    res.json({ message: "Reset link sent! Check your email.📩" });

  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});


// -------------------- Reset Password --------------------
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ error: "New password is required" });

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "reset") return res.status(400).json({ error: "Invalid token" });

    // Find the user with this token
    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND reset_token = $2",
      [decoded.id, token]
    );
    const user = userResult.rows[0];

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear the reset token
    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password has been reset successfully!🌟" });

  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
});


// -------------------- Request Account Deletion --------------------
router.post('/request-delete', async (req, res) => {
  try {
    const emailInput = (req.body.email || "").trim().toLowerCase();
    if (!emailInput) return res.status(400).json({ error: "Email is required" });

    const userResult = await pool.query(
      "SELECT id, username FROM users WHERE LOWER(TRIM(email)) = $1",
      [emailInput]
    );
    if (!userResult.rows.length) return res.status(404).json({ error: "User not found" });

    const user = userResult.rows[0];

    // Generate random token
    const token = crypto.randomBytes(32).toString("hex");

    // Store token in DB with 1-hour expiration
    await pool.query(
      "INSERT INTO delete_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + interval '1 hour')",
      [user.id, token]
    );

    // Send deletion confirmation email
    const deletionLink = `${FRONTEND_URL}/delete/${token}`;
    await sgMail.send({
      to: emailInput,
      from: process.env.SENDGRID_EMAIL,
      subject: "Confirm Account Deletion",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height:1.6; max-width:600px; margin:0 auto; padding:20px; background-color:#f0f0f0;">
          <div style="background-color:#ffffff; border-radius:12px; padding:30px; text-align:center; border:1px solid #e0e0e0;">
            <h2>Hello ${user.username},</h2>
            <p>Click the button below to permanently delete your account. This link will expire in 1 hour.</p>
            <div style="margin:30px 0;">
              <a href="${deletionLink}" 
                style="display:inline-block; background:#FF4C4C; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">
                Delete My Account
              </a>
            </div>
            <p style="font-size:12px; color:#777;">
              If the button doesn’t work, copy and paste this link:<br>
              <code style="word-break:break-all;">${deletionLink}</code>
            </p>
          </div>
        </div>
      `
    });

    res.json({ message: "Deletion confirmation link sent! Check your email.📩" });
  } catch (error) {
    console.error("Error in request-delete:", error);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});


// -------------------- Confirm & Delete Account --------------------
router.get('/delete/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const tokenResult = await pool.query(
      "SELECT user_id FROM delete_tokens WHERE token=$1 AND expires_at > NOW()",
      [token]
    );
    if (!tokenResult.rows.length) return res.status(400).send("Invalid or expired token.");

    const userId = tokenResult.rows[0].user_id;

    // Delete user and token
    await pool.query("DELETE FROM users WHERE id=$1", [userId]);
    await pool.query("DELETE FROM delete_tokens WHERE user_id=$1", [userId]);

    res.send("Your account has been permanently deleted.");
  } catch (error) {
    console.error("Error in delete/:token:", error);
    res.status(500).send("Server error during account deletion.");
  }
});

module.exports = router;