// server/socket/notifications.js
module.exports = (io, pool) => {
  console.log('🔔 Notifications socket module initialized');

  // Attach a global emit function to io (so you can call it from anywhere)
  io.emitNotification = async (userId, notificationData) => {
    try {
      // Emit to user's personal room (user must join it on frontend)
      io.to(`user_${userId}`).emit('new_notification', {
        ...notificationData,
        // id: Date.now(), // or generate proper ID if needed
        timestamp: new Date().toISOString()
      });
      console.log(`📤 Notification sent to user ${userId}`);
    } catch (err) {
      console.error('❌ Failed to emit notification:', err);
    }
  };

  // Handle user joining their notification room
  io.on('connection', (socket) => {
    socket.on('joinUser', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined notification room`);
      }
    });
  });
};