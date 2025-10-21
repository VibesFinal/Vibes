const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pg = require('pg');
require('dotenv').config();
 
// DB
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
console.log("🌐 Connecting",process.env.DATABASE_URL);

// Error messages
const { ERROR_MESSAGES } = require("../utils/errorMessages.js");
 
// Welcome generator
const { generateWelcomeMessage } = require('./welcome');
 
// -------------------- Verify Email --------------------
router.get('/:token', async (req, res) => {
  const { token } = req.params;
 
  // if (!token) {
  //   return res.status(400).json({ error: "❌ Token missing" });
  // }
  if (!token) {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.AUTH.TOKEN_MISSING,
      type: "error",
    });
  } 
  console.log(`[VERIFY] 🔍 Incoming verification for token: ${token.substring(0, 20)}...`);
 
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);
 
    // Ensure it's an email verification token
    // if (decoded.type !== "verify") {
    //   console.log("❌ Invalid token type:", decoded.type);
    //   return res.status(400).json({ error: "Invalid token type" });
    // }
    if (decoded.type !== "verify") {
      console.log("❌ Invalid token type:", decoded.type);
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.AUTH.INVALID_TOKEN,
        type: "error",
      });
    }    
    console.log("🔑 User ID from token:", decoded.id);
 
    // Fetch user from DB (whether verified or not)
    const userResult = await pool.query(
      "SELECT id, username, email, verified FROM users WHERE id = $1",
      [decoded.id]
    );
 
    // if (userResult.rows.length === 0) {
    //   console.log("❌ No user found with ID:", decoded.id);
    //   return res.status(400).json({ error: "User not found" });
    // }
    if (userResult.rows.length === 0) {
      console.log("❌ No user found with ID:", decoded.id);
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER.NOT_FOUND,
        type: "error",
      });
    } 
    const user = userResult.rows[0];
    console.log(`👤 Found user: ${user.username} (verified: ${user.verified})`);
 
    // Only update if not already verified
    if (!user.verified) {
      console.log("📝 Updating user to verified = true...");
      const updateResult = await pool.query(
        "UPDATE users SET verified = true WHERE id = $1 RETURNING id, username, email",
        [decoded.id]
      );
 
      if (updateResult.rowCount === 0) {
        console.warn("⚠️ Update returned 0 rows — possible race condition or DB issue.");
        return res.status(500).json({
          success: false,
          message: ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
          type: "error",
        });

        // But we continue — user exists and we’ll log them in anyway
      } else {
        console.log("✅ User successfully verified:", updateResult.rows[0]);
      }
    } else {
      console.log("ℹ️ User was already verified.");
    }
 
    // ALWAYS generate a session token and log user in
    const sessionToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "60d" }
    );
 
    const welcomeMessage = user.verified
      ? `Welcome back, ${user.username}! You're already verified.`
      : await generateWelcomeMessage(user.username);
 
    console.log("🎉 Session token generated. Sending response...");
 
    // Return consistent JSON response
    res.json({
      success: true,
      token: sessionToken,
      welcomeMessage,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        verified: user.verified
      }
    });
 
  } catch (error) {
    console.error("❌ Verification error:", error.message); 
    // if (error.name === "TokenExpiredError") {
    //   return res.status(400).json({ error: "Verification token expired. Please register again or request a new link." });
    // } 
    // return res.status(400).json({ error: "Invalid or malformed token" });

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Verification token expired. Please register again or request a new link.",
        type: "error",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid or malformed token",
      type: "error",
    });
  }
});
 
module.exports = router;