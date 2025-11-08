// src/components/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell } from 'phosphor-react';

const NotificationBell = ({ size = 24, shouldClose }) => {
  const { unreadCount, notifications, markAsRead, markAllAsRead, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  
  // closes the dropdown when shouldClose changes to true
  useEffect(() => {
    if (shouldClose) setIsOpen(false);
  }, [shouldClose]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-dropdown') && !event.target.closest('.notification-button')) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);



  return (
    <div className="relative">
      {/* Modern Glassmorphic Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-2xl bg-white/80 backdrop-blur-2xl hover:bg-white/90 transition-all duration-300 border border-[#e9d5ff]/50 shadow-sm hover:shadow-md"
        aria-label="Notifications"
      >
        {/* Bell Icon: Primary brand color */}
        <Bell
          size={size}
          weight="regular"
          className="text-[#1e293b]"
        />

        {/* Badge: Brand gradient with soft border */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-gradient-to-r from-[#C05299] to-[#D473B3] rounded-full border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-2xl shadow-xl rounded-2xl z-50 max-h-96 overflow-y-auto border border-[#e9d5ff]/50"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="p-4 border-b border-[#e9d5ff]/30 flex justify-between items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-[#1e293b]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs font-medium bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white px-3 py-1 rounded-full hover:shadow-md transition-all duration-300"
              >
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-4 text-center text-[#64748b] text-sm">
              <div className="animate-pulse rounded-full h-4 w-24 bg-[#f5f3ff] mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-[#64748b] text-sm">
              <Bell size={24} weight="light" className="mx-auto mb-2 text-[#C05299]/30" />
              <p>No new notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#e9d5ff]/30" onClick={(e) => e.stopPropagation()}>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-4 hover:bg-[#fdf2f8]/50 transition-colors ${
                    !notif.is_read ? 'bg-[#fdf2f8]/30 border-l-4 border-[#C05299]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className={`text-sm ${!notif.is_read ? 'text-[#1e293b] font-medium' : 'text-[#64748b]'}`}>
                      {notif.message}
                    </p>
                    {!notif.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="text-xs font-medium text-[#C05299] hover:text-[#9333EA] transition-colors whitespace-nowrap"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#64748b]/80 mt-2">
                    {new Date(notif.created_at || notif.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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