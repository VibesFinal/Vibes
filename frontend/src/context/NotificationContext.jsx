import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../api/axiosInstance'; // ← Step 1: Import axios instance
import { BACKEND_URL } from '../api/axiosInstance';

const NotificationContext = createContext();

// Replace with your backend URL
const SOCKET_URL = BACKEND_URL; // or your deployed URL

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

  // Step 2: Fetch unread notifications using axios
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await axiosInstance.get(`/notifications/unread/${userId}`);
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Step 3: Mark a notification as read using axios
  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Step 4: Mark all as read using axios
  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.is_read)
      .map((n) => n.id);

    try {
      await Promise.all(
        unreadIds.map((id) => axiosInstance.patch(`/notifications/read/${id}`))
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
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