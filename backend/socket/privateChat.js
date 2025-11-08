// socket/privateChat.js
const jwt = require('jsonwebtoken');

module.exports = (io, pool) => {
  // Middleware: authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.username = decoded.username;
      socket.isTherapist = decoded.isTherapist;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Helper: Emit updated conversation metadata to room
  const emitConversationUpdate = async (roomId, conversationId) => {
    try {
      const result = await pool.query(`
        SELECT 
          (SELECT json_build_object(
            'id', pm.id,
            'content', pm.content,
            'created_at', pm.created_at,
            'is_edited', pm.is_edited,
            'is_deleted', pm.is_deleted,
            'sender_id', pm.sender_id
          )
          FROM private_messages pm 
          WHERE pm.conversation_id = pc.id 
            AND pm.is_deleted = false 
          ORDER BY pm.created_at DESC 
          LIMIT 1
        ) AS last_message
        FROM private_conversations pc
        WHERE pc.id = $1
      `, [conversationId]);

      const last_message = result.rows[0]?.last_message || null;

      io.to(roomId).emit('conversationUpdated', {
        conversationId,
        last_message
      });
    } catch (err) {
      console.error('❌ Failed to emit conversationUpdated:', err);
    }
  };

  io.on('connection', (socket) => {
    console.log(`✅ Private chat connected: ${socket.username} (${socket.userId})`);

    socket.on('joinPrivateChat', async ({ recipientId }) => {
      try {
        const parsedRecipientId = parseInt(recipientId, 10);
        if (isNaN(parsedRecipientId)) {
          socket.emit('error', { message: 'Invalid recipient ID' });
          return;
        }

        const roomId = [socket.userId, parsedRecipientId].sort((a, b) => a - b).join('-');
        socket.join(roomId);
        socket.currentRoom = roomId;
        socket.recipientId = parsedRecipientId;

        console.log(`💬 ${socket.username} joined room: ${roomId}`);

        let convResult = await pool.query(
          `SELECT id FROM private_conversations 
           WHERE (user_id = $1 AND therapist_id = $2) 
              OR (user_id = $2 AND therapist_id = $1)`,
          [socket.userId, parsedRecipientId]
        );

        let conversationId;
        if (convResult.rows.length === 0) {
          const insertResult = await pool.query(
            `INSERT INTO private_conversations (user_id, therapist_id, last_message_at) 
             VALUES ($1, $2, NOW()) 
             RETURNING id`,
            [socket.userId, parsedRecipientId]
          );
          conversationId = insertResult.rows[0].id;
          console.log(`✨ Created new conversation: ${conversationId}`);
        } else {
          conversationId = convResult.rows[0].id;
        }

        socket.conversationId = conversationId;

        // Initial emit (optional but helpful)
        await emitConversationUpdate(roomId, conversationId);
      } catch (err) {
        console.error('❌ Error joining private chat:', err);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    socket.on('sendPrivateMessage', async ({ recipientId, content }) => {
      try {
        if (!content?.trim()) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        const parsedRecipientId = parseInt(recipientId, 10);
        if (isNaN(parsedRecipientId)) {
          socket.emit('error', { message: 'Invalid recipient ID' });
          return;
        }

        const result = await pool.query(
          `INSERT INTO private_messages (conversation_id, sender_id, content) 
           VALUES ($1, $2, $3) 
           RETURNING id, sender_id, content, created_at, is_edited, is_deleted`,
          [socket.conversationId, socket.userId, content.trim()]
        );

        const message = result.rows[0];

        const userResult = await pool.query(
          `SELECT username, profile_pic, is_therapist FROM users WHERE id = $1`,
          [socket.userId]
        );

        const fullMessage = {
          ...message,
          username: userResult.rows[0].username,
          profile_pic: userResult.rows[0].profile_pic,
          is_therapist: userResult.rows[0].is_therapist
        };

        socket.emit('privateMessageSent', fullMessage);
        socket.to(socket.currentRoom).emit('privateMessageReceived', fullMessage);

        // ✅ Update last_message_at AND emit conversation update
        await pool.query(
          `UPDATE private_conversations 
           SET last_message_at = NOW() 
           WHERE id = $1`,
          [socket.conversationId]
        );

        await emitConversationUpdate(socket.currentRoom, socket.conversationId);

        console.log(`📤 Message sent from ${socket.username} to recipient ${parsedRecipientId}`);
      } catch (err) {
        console.error('❌ Error sending private message:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('editMessage', async ({ messageId, newContent }) => {
      try {
        if (!newContent?.trim()) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        const parsedMessageId = parseInt(messageId, 10);
        if (isNaN(parsedMessageId)) {
          socket.emit('error', { message: 'Invalid message ID' });
          return;
        }

        const checkResult = await pool.query(
          `SELECT sender_id FROM private_messages WHERE id = $1`,
          [parsedMessageId]
        );

        if (!checkResult.rows.length || checkResult.rows[0].sender_id !== socket.userId) {
          socket.emit('error', { message: 'Unauthorized to edit this message' });
          return;
        }

        await pool.query(
          `UPDATE private_messages 
           SET content = $1, is_edited = true, edited_at = NOW() 
           WHERE id = $2`,
          [newContent.trim(), parsedMessageId]
        );

        io.to(socket.currentRoom).emit('messageEdited', {
          messageId: parsedMessageId,
          newContent: newContent.trim()
        });

        // ✅ Emit updated conversation (in case edited message is last)
        await emitConversationUpdate(socket.currentRoom, socket.conversationId);

        console.log(`✏️ Message ${parsedMessageId} edited by ${socket.username}`);
      } catch (err) {
        console.error('❌ Error editing message:', err);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    socket.on('deleteMessage', async ({ messageId }) => {
      try {
        const parsedMessageId = parseInt(messageId, 10);
        if (isNaN(parsedMessageId)) {
          socket.emit('error', { message: 'Invalid message ID' });
          return;
        }

        const checkResult = await pool.query(
          `SELECT sender_id FROM private_messages WHERE id = $1`,
          [parsedMessageId]
        );

        if (!checkResult.rows.length || checkResult.rows[0].sender_id !== socket.userId) {
          socket.emit('error', { message: 'Unauthorized to delete this message' });
          return;
        }

        await pool.query(
          `UPDATE private_messages SET is_deleted = true WHERE id = $1`,
          [parsedMessageId]
        );

        io.to(socket.currentRoom).emit('messageDeleted', { messageId: parsedMessageId });

        // ✅ Critical: refresh last_message (may now be previous msg or null)
        await emitConversationUpdate(socket.currentRoom, socket.conversationId);

        console.log(`🗑️ Message ${parsedMessageId} deleted by ${socket.username}`);
      } catch (err) {
        console.error('❌ Error deleting message:', err);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    socket.on('userTyping', ({ recipientId }) => {
      socket.to(socket.currentRoom).emit('userTyping', { userId: socket.userId });
    });

    socket.on('stopTyping', ({ recipientId }) => {
      socket.to(socket.currentRoom).emit('userStoppedTyping', { userId: socket.userId });
    });

    socket.on('leavePrivateChat', () => {
      if (socket.currentRoom) {
        socket.leave(socket.currentRoom);
        console.log(`👋 ${socket.username} left room: ${socket.currentRoom}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Private chat disconnected: ${socket.username}`);
    });
  });
};