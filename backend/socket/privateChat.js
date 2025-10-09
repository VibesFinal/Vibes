const jwt = require('jsonwebtoken');

module.exports = (io, pool) => {
  console.log('🔐 Socket.io private chat module initialized');

  // 🔑 JWT Authentication Middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required for private chat'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  const userSocketMap = new Map();

  io.on('connection', (socket) => {
    const userId = socket.userId;
    userSocketMap.set(userId, socket.id);
    console.log(`✅ User ${userId} connected for private chat`);

    // 💬 Send message
    socket.on('sendPrivateMessage', async ({ recipientId, content }) => {
      if (!recipientId || !content?.trim()) {
        return socket.emit('privateMessageError', 'Recipient and message required');
      }
      if (recipientId === socket.userId) {
        return socket.emit('privateMessageError', 'Cannot message yourself');
      }

      try {
        // Fetch both users' roles AND usernames in one go
        const [senderRes, recipientRes] = await Promise.all([
          pool.query('SELECT is_therapist, username FROM users WHERE id = $1', [socket.userId]),
          pool.query('SELECT is_therapist, username FROM users WHERE id = $1', [recipientId]),
        ]);

        if (!senderRes.rows.length || !recipientRes.rows.length) {
          return socket.emit('privateMessageError', 'User not found');
        }

        const senderIsTherapist = senderRes.rows[0].is_therapist;
        const recipientIsTherapist = recipientRes.rows[0].is_therapist;
        const senderUsername = senderRes.rows[0].username;
        // recipientUsername is not needed in payload, but good to validate

        if (senderIsTherapist === recipientIsTherapist) {
          return socket.emit('privateMessageError', 'Chat is only allowed between a user and a therapist');
        }

        // Find or create conversation
        const conv = await pool.query(
          `SELECT id, user_id, therapist_id FROM private_conversations 
           WHERE (user_id = $1 AND therapist_id = $2) 
              OR (user_id = $2 AND therapist_id = $1)`,
          [socket.userId, recipientId]
        );

        let conversationId;
        if (conv.rows.length === 0) {
          const userId = senderIsTherapist ? recipientId : socket.userId;
          const therapistId = senderIsTherapist ? socket.userId : recipientId;
          const insert = await pool.query(
            `INSERT INTO private_conversations (user_id, therapist_id) 
             VALUES ($1, $2) RETURNING id`,
            [userId, therapistId]
          );
          conversationId = insert.rows[0].id;
        } else {
          conversationId = conv.rows[0].id;
        }

        // Insert message
        const msg = await pool.query(
          `INSERT INTO private_messages (conversation_id, sender_id, content)
           VALUES ($1, $2, $3) RETURNING id, created_at`,
          [conversationId, socket.userId, content.trim()]
        );

        const payload = {
          id: msg.rows[0].id,
          senderId: socket.userId,
          recipientId,
          content: content.trim(),
          timestamp: msg.rows[0].created_at,
          username: senderUsername, // ✅ Real username included!
        };

        socket.emit('privateMessageSent', payload);

        const recipientSocketId = userSocketMap.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('privateMessageReceived', payload);
        }
      } catch (err) {
        console.error('Private message error:', err);
        socket.emit('privateMessageError', 'Failed to send message');
      }
    });

    // 🖊️ Edit message
    socket.on('editPrivateMessage', async ({ messageId, newContent }) => {
      if (!messageId || !newContent?.trim()) {
        return socket.emit('privateMessageError', 'Message ID and content required');
      }

      try {
        // Fetch message and sender's username in one query
        const msgRes = await pool.query(
          `SELECT pm.sender_id, pm.conversation_id, u.username
           FROM private_messages pm
           JOIN users u ON pm.sender_id = u.id
           WHERE pm.id = $1 AND pm.sender_id = $2`,
          [messageId, socket.userId]
        );

        if (msgRes.rows.length === 0) {
          return socket.emit('privateMessageError', 'Message not found or not owned by you');
        }

        const { conversation_id: convId, username: senderUsername } = msgRes.rows[0];

        const updated = await pool.query(
          `UPDATE private_messages 
           SET content = $1, edited_at = NOW() 
           WHERE id = $2 
           RETURNING id, content, edited_at`,
          [newContent.trim(), messageId]
        );

        const payload = {
          id: updated.rows[0].id,
          content: updated.rows[0].content,
          editedAt: updated.rows[0].edited_at,
          username: senderUsername, // ✅ Include for consistency
        };

        socket.emit('privateMessageEdited', payload);

        // Notify the other participant
        const conv = await pool.query(
          'SELECT user_id, therapist_id FROM private_conversations WHERE id = $1',
          [convId]
        );

        if (conv.rows.length > 0) {
          const { user_id, therapist_id } = conv.rows[0];
          const otherId = user_id === socket.userId ? therapist_id : user_id;
          const otherSocketId = userSocketMap.get(otherId);
          if (otherSocketId) {
            io.to(otherSocketId).emit('privateMessageEdited', payload);
          }
        }
      } catch (err) {
        console.error('Edit message error:', err);
        socket.emit('privateMessageError', 'Failed to edit message');
      }
    });

    // 🗑️ Delete message (soft delete)
    socket.on('deletePrivateMessage', async ({ messageId }) => {
      if (!messageId) {
        return socket.emit('privateMessageError', 'Message ID required');
      }

      try {
        const msgRes = await pool.query(
          `SELECT sender_id, conversation_id 
           FROM private_messages 
           WHERE id = $1 AND sender_id = $2`,
          [messageId, socket.userId]
        );

        if (msgRes.rows.length === 0) {
          return socket.emit('privateMessageError', 'Message not found or not owned by you');
        }

        await pool.query(
          'UPDATE private_messages SET is_deleted = true WHERE id = $1',
          [messageId]
        );

        const payload = { id: messageId };
        socket.emit('privateMessageDeleted', payload);

        // Notify the other participant
        const { conversation_id: convId } = msgRes.rows[0];
        const conv = await pool.query(
          'SELECT user_id, therapist_id FROM private_conversations WHERE id = $1',
          [convId]
        );

        if (conv.rows.length > 0) {
          const { user_id, therapist_id } = conv.rows[0];
          const otherId = user_id === socket.userId ? therapist_id : user_id;
          const otherSocketId = userSocketMap.get(otherId);
          if (otherSocketId) {
            io.to(otherSocketId).emit('privateMessageDeleted', payload);
          }
        }
      } catch (err) {
        console.error('Delete message error:', err);
        socket.emit('privateMessageError', 'Failed to delete message');
      }
    });

    socket.on('disconnect', () => {
      userSocketMap.delete(userId);
      console.log(`🔌 User ${userId} disconnected from private chat`);
    });
  });
};