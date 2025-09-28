import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const NotificationContext = createContext();

// Replace with your backend URL
const SOCKET_URL = 'http://localhost:7777'; // or your deployed URL

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize socket
  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL);

    // Join user room
    socket.emit('joinUser', userId);

    // Listen for new notifications
   socket.on('new_notification', (newNotif) => {
   console.log('🔔 RECEIVED real-time notification:', newNotif);
   setNotifications((prev) => [newNotif, ...prev]);
   });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Fetch unread notifications on mount
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/notifications/unread/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await fetch(`/notifications/read/${id}`, {
        method: 'PATCH',
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.is_read)
      .map((n) => n.id);

    await Promise.all(
      unreadIds.map((id) => fetch(`/notifications/read/${id}`, { method: 'PATCH' }))
    );

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        markAsRead,
        markAllAsRead,
        unreadCount: notifications.filter((n) => !n.is_read).length,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};