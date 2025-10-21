const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken'); 

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// Error messages
const { ERROR_MESSAGES } = require("../utils/errorMessages.js");

// GET /api/private-chat/history/:therapistId
router.get('/history/:therapistId', routeGuard, async (req, res) => {
  try {
    const { therapistId } = req.params;
    const userId = req.user.id; // 👈 set by routeGuard (from JWT)

    // Validate therapistId is a valid integer
    const parsedTherapistId = parseInt(therapistId, 10);
    // if (isNaN(parsedTherapistId) || parsedTherapistId <= 0) {
    //   return res.status(400).json({ error: 'Invalid therapist ID' });
    // }    
    if (isNaN(parsedTherapistId) || parsedTherapistId <= 0) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.USER.INVALID_ID || "Invalid therapist ID",
        type: "error",
      });
    }

    // Prevent user from fetching their own "chat"
    // if (userId === parsedTherapistId) {
    //   return res.status(400).json({ error: 'Cannot chat with yourself' });
    // }
    if (userId === parsedTherapistId) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.CHAT.UNAUTHORIZED_ACCESS ,
        type: "error",
      });
    }

    // Find existing private conversation
    const convResult = await pool.query(
      `SELECT id FROM private_conversations 
       WHERE (user_id = $1 AND therapist_id = $2) 
          OR (user_id = $2 AND therapist_id = $1)`,
      [userId, parsedTherapistId]
    );

    // if (convResult.rows.length === 0) {
    //   return res.status(404).json({ error: 'No conversation found' });
    // }
    if (convResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.CHAT.CONVERSATION_NOT_FOUND,
        type: "error",
      });
    }
    const conversationId = convResult.rows[0].id;

    // Fetch all messages in the conversation
    const messagesResult = await pool.query(
      `SELECT 
          pm.id,
          pm.sender_id,
          pm.content,
          pm.created_at,
          pm.edited_at,
          pm.is_deleted,
          u.username,
          u.profile_pic,
          u.is_therapist
       FROM private_messages pm
       JOIN users u ON pm.sender_id = u.id
       WHERE pm.conversation_id = $1 
         AND pm.is_deleted = false
       ORDER BY pm.created_at ASC`,
      [conversationId]
    );

    // res.status(200).json(messagesResult.rows);
    res.status(200).json({
      success: true,
      message: ERROR_MESSAGES.CHAT.MESSAGE_SEND_SUCCESS,
      type: "success",
      data: messagesResult.rows,
    });

  } catch (err) {
    console.error('❌ Private chat history error:', err);
    // res.status(500).json({ error: 'Failed to load chat history' });
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.CHAT.LOAD_HISTORY_FAILED, 
      type: "error",
    });
  }
});

module.exports = router;