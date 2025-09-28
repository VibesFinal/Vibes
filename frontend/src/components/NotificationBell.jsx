// src/components/NotificationBell.jsx
import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell } from 'phosphor-react';

const NotificationBell = ({ size = 30 }) => {
  console.log("✅ Rendering white notification bell");
  const { unreadCount, notifications, markAsRead, markAllAsRead, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* White Button with Black Border */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-1 rounded-full bg-white hover:bg-gray-100 transition-colors border-2 border-black"
        aria-label="Notifications"
      >
        {/* Bell Icon: Black (to match other icons) */}
        <Bell
          size={size}
          weight="regular" // outline style (like your other icons)
          className="text-black"
        />

        {/* Badge: White Circle with Black Text & Border */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-black bg-white rounded-full border border-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown (unchanged) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md z-50 max-h-96 overflow-y-auto border border-gray-300">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  markAllAsRead();
                  setIsOpen(false);
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
          ) : (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notif.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    {!notif.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.created_at || notif.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;