module.exports = (namespace, pool) => {
  console.log('💬 Community chat namespace initialized');

  namespace.on('connection', (socket) => {
    console.log('✅ Community client connected:', socket.id);

    // 🔑 Join a community chat room
    socket.on('joinCommunity', (communityId) => {
      if (!communityId) {
        console.warn(`⚠️ Socket ${socket.id} tried to join without communityId`);
        return;
      }
      const roomId = String(communityId);
      socket.join(roomId);
      console.log(`🚪 Socket ${socket.id} joined room: "${roomId}"`);
    });

    // 🚪 Leave a community chat room
    socket.on('leaveCommunity', (communityId) => {
      if (!communityId) return;
      const roomId = String(communityId);
      socket.leave(roomId);
      console.log(`🚪 Socket ${socket.id} left room: "${roomId}"`);
    });

    // 💬 Send message to room + save to DB
    socket.on('sendMessage', async ({ communityId, userId, message }) => {
      console.log('📩 RECEIVED MESSAGE:', { communityId, userId, message });

      if (!communityId || !userId || !message?.trim()) {
        console.warn('⚠️ Invalid message data:', { communityId, userId, message });
        socket.emit('errorMessage', 'Invalid message data');
        return;
      }

      try {
        console.log('💾 ATTEMPTING TO SAVE TO DB...');

        const result = await pool.query(
          `INSERT INTO messages (community_id, user_id, content) 
           VALUES ($1, $2, $3) 
           RETURNING *`,
          [communityId, userId, message.trim()]
        );

        console.log('✅ MESSAGE SAVED:', result.rows[0]);

        const savedMessage = result.rows[0];

        const userResult = await pool.query(
          `SELECT username FROM users WHERE id = $1`,
          [savedMessage.user_id]
        );

        const senderName = userResult.rows[0]?.username || 'Anonymous';
        const roomId = String(savedMessage.community_id);

        // ✅ Use namespace.to, NOT io.to
        namespace.to(roomId).emit('receiveMessage', {
          id: savedMessage.id,
          communityId: savedMessage.community_id,
          userId: savedMessage.user_id,
          message: savedMessage.content,
          timestamp: savedMessage.created_at,
          senderName: senderName,
          is_deleted: false,
          edited_at: null,
        });

        console.log(`📤 BROADCAST TO ROOM "${roomId}"`);

      } catch (err) {
        console.error('❌ FAILED TO SAVE MESSAGE:', err.message);
        console.error('❌ ERROR STACK:', err.stack);
        socket.emit('errorMessage', 'Failed to send message. Please try again.');
      }
    });

    // ✏️ EDIT MESSAGE
    socket.on('editMessage', async ({ messageId, newContent, userId }) => {
      if (!messageId || !newContent?.trim() || !userId) {
        console.warn('⚠️ Invalid edit data:', { messageId, newContent, userId });
        return socket.emit('errorMessage', 'Invalid edit data');
      }

      try {
        const result = await pool.query(
          `UPDATE messages 
           SET content = $1, edited_at = NOW() 
           WHERE id = $2 AND user_id = $3 AND is_deleted = false
           RETURNING id, content, edited_at, community_id`,
          [newContent.trim(), messageId, userId]
        );

        if (result.rowCount === 0) {
          console.warn(`⚠️ Edit failed: Message ${messageId} not found or not owned by user ${userId}`);
          return socket.emit('errorMessage', 'Message not found or you are not authorized to edit it.');
        }

        const updated = result.rows[0];
        const roomId = String(updated.community_id);

        // ✅ Use namespace.to
        namespace.to(roomId).emit('messageEdited', {
          id: updated.id,
          message: updated.content,
          edited_at: updated.edited_at,
        });

        console.log(`✏️ Message ${messageId} edited by user ${userId} in room "${roomId}"`);

      } catch (err) {
        console.error('❌ Failed to edit message:', err);
        socket.emit('errorMessage', 'Failed to edit message. Please try again.');
      }
    });

    // 🗑️ DELETE MESSAGE (soft delete)
    socket.on('deleteMessage', async ({ messageId, userId }) => {
      if (!messageId || !userId) {
        console.warn('⚠️ Invalid delete data:', { messageId, userId });
        return socket.emit('errorMessage', 'Invalid delete data');
      }

      try {
        const result = await pool.query(
          `UPDATE messages 
           SET is_deleted = true 
           WHERE id = $1 AND user_id = $2 AND is_deleted = false
           RETURNING id, community_id`,
          [messageId, userId]
        );

        if (result.rowCount === 0) {
          console.warn(`⚠️ Delete failed: Message ${messageId} not found or not owned by user ${userId}`);
          return socket.emit('errorMessage', 'Message not found or you are not authorized to delete it.');
        }

        const deleted = result.rows[0];
        const roomId = String(deleted.community_id);

        // ✅ Use namespace.to
        namespace.to(roomId).emit('messageDeleted', {
          id: deleted.id,
        });

        console.log(`🗑️ Message ${messageId} deleted by user ${userId} in room "${roomId}"`);

      } catch (err) {
        console.error('❌ Failed to delete message:', err);
        socket.emit('errorMessage', 'Failed to delete message. Please try again.');
      }
    });

    // 🖊️ Handle typing indicator
    socket.on('typing', ({ communityId, username, isTyping }) => {
      if (!communityId || !username) {
        console.warn('⚠️ Invalid typing data:', { communityId, username });
        return;
      }

      const roomId = String(communityId);

      // ✅ socket.to() is fine here (same namespace)
      socket.to(roomId).emit('userTyping', {
        username,
        isTyping: true,
      });

      setTimeout(() => {
        socket.to(roomId).emit('userTyping', {
          username,
          isTyping: false,
        });
      }, 3000);
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Community client disconnected: ${socket.id}`);
    });
  });
};