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

  io.on('connection', (socket) => {
    console.log(`✅ Private chat connected: ${socket.username} (${socket.userId})`);

    // Join private chat room
    socket.on('joinPrivateChat', async ({ recipientId }) => {
      try {
        const parsedRecipientId = parseInt(recipientId, 10);
        if (isNaN(parsedRecipientId)) {
          socket.emit('error', { message: 'Invalid recipient ID' });
          return;
        }

        // Create room identifier (sorted IDs for consistency)
        const roomId = [socket.userId, parsedRecipientId].sort((a, b) => a - b).join('-');
        socket.join(roomId);
        socket.currentRoom = roomId;
        socket.recipientId = parsedRecipientId;

        console.log(`💬 ${socket.username} joined room: ${roomId}`);

        // Find or create conversation
        let convResult = await pool.query(
          `SELECT id FROM private_conversations 
           WHERE (user_id = $1 AND therapist_id = $2) 
              OR (user_id = $2 AND therapist_id = $1)`,
          [socket.userId, parsedRecipientId]
        );

        let conversationId;
        if (convResult.rows.length === 0) {
          // Create new conversation
          const insertResult = await pool.query(
            `INSERT INTO private_conversations (user_id, therapist_id) 
             VALUES ($1, $2) 
             RETURNING id`,
            [socket.userId, parsedRecipientId]
          );
          conversationId = insertResult.rows[0].id;
          console.log(`✨ Created new conversation: ${conversationId}`);
        } else {
          conversationId = convResult.rows[0].id;
        }

        socket.conversationId = conversationId;
      } catch (err) {
        console.error('❌ Error joining private chat:', err);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Send private message
    socket.on('sendPrivateMessage', async ({ recipientId, content }) => {
      try {
        if (!content || !content.trim()) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        const parsedRecipientId = parseInt(recipientId, 10);
        if (isNaN(parsedRecipientId)) {
          socket.emit('error', { message: 'Invalid recipient ID' });
          return;
        }

        // Insert message into database
        const result = await pool.query(
          `INSERT INTO private_messages (conversation_id, sender_id, content) 
           VALUES ($1, $2, $3) 
           RETURNING id, sender_id, content, created_at, is_edited, is_deleted`,
          [socket.conversationId, socket.userId, content.trim()]
        );

        const message = result.rows[0];

        // Get sender info
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

        // Emit to sender
        socket.emit('privateMessageSent', fullMessage);

        // Emit to recipient (if they're in the room)
        const roomId = socket.currentRoom;
        socket.to(roomId).emit('privateMessageReceived', fullMessage);

        // Update conversation's last_message_at
        await pool.query(
          `UPDATE private_conversations 
           SET last_message_at = NOW() 
           WHERE id = $1`,
          [socket.conversationId]
        );

        console.log(`📤 Message sent from ${socket.username} to recipient ${parsedRecipientId}`);
      } catch (err) {
        console.error('❌ Error sending private message:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Edit message
    socket.on('editMessage', async ({ messageId, newContent }) => {
      try {
        if (!newContent || !newContent.trim()) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        const parsedMessageId = parseInt(messageId, 10);
        if (isNaN(parsedMessageId)) {
          socket.emit('error', { message: 'Invalid message ID' });
          return;
        }

        // Verify the message belongs to the sender
        const checkResult = await pool.query(
          `SELECT sender_id, conversation_id FROM private_messages WHERE id = $1`,
          [parsedMessageId]
        );

        if (checkResult.rows.length === 0) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (checkResult.rows[0].sender_id !== socket.userId) {
          socket.emit('error', { message: 'Unauthorized to edit this message' });
          return;
        }

        // Update the message in database
        await pool.query(
          `UPDATE private_messages 
           SET content = $1, is_edited = true, edited_at = NOW() 
           WHERE id = $2`,
          [newContent.trim(), parsedMessageId]
        );

        // Broadcast to all users in the room
        const roomId = socket.currentRoom;
        io.to(roomId).emit('messageEdited', {
          messageId: parsedMessageId,
          newContent: newContent.trim()
        });

        console.log(`✏️ Message ${parsedMessageId} edited by ${socket.username}`);
      } catch (err) {
        console.error('❌ Error editing message:', err);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Delete message
    socket.on('deleteMessage', async ({ messageId }) => {
      try {
        const parsedMessageId = parseInt(messageId, 10);
        if (isNaN(parsedMessageId)) {
          socket.emit('error', { message: 'Invalid message ID' });
          return;
        }

        // Verify the message belongs to the sender
        const checkResult = await pool.query(
          `SELECT sender_id, conversation_id FROM private_messages WHERE id = $1`,
          [parsedMessageId]
        );

        if (checkResult.rows.length === 0) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (checkResult.rows[0].sender_id !== socket.userId) {
          socket.emit('error', { message: 'Unauthorized to delete this message' });
          return;
        }

        // Mark message as deleted in database
        await pool.query(
          `UPDATE private_messages 
           SET is_deleted = true 
           WHERE id = $1`,
          [parsedMessageId]
        );

        // Broadcast to all users in the room
        const roomId = socket.currentRoom;
        io.to(roomId).emit('messageDeleted', { messageId: parsedMessageId });

        console.log(`🗑️ Message ${parsedMessageId} deleted by ${socket.username}`);
      } catch (err) {
        console.error('❌ Error deleting message:', err);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // User typing indicator
    socket.on('userTyping', ({ recipientId }) => {
      const roomId = socket.currentRoom;
      socket.to(roomId).emit('userTyping', { userId: socket.userId });
    });

    socket.on('stopTyping', ({ recipientId }) => {
      const roomId = socket.currentRoom;
      socket.to(roomId).emit('userStoppedTyping', { userId: socket.userId });
    });

    // Leave private chat
    socket.on('leavePrivateChat', ({ recipientId }) => {
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