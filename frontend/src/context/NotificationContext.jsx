import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';
import { BACKEND_URL } from '../api/axiosInstance';

const NotificationContext = createContext();

const SOCKET_URL = BACKEND_URL;

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

  // Fetch unread notifications
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

  // Mark a notification as read and REMOVE it from the list
  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/read/${id}`);
      
      // Remove the notification from the list instead of just marking it as read
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Mark all as read and CLEAR the list
  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.is_read)
      .map((n) => n.id);

    try {
      await Promise.all(
        unreadIds.map((id) => axiosInstance.patch(`/notifications/read/${id}`))
      );

      // Clear all notifications from the list
      setNotifications([]);
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