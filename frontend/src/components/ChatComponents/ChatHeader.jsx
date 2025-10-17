import React, { useState, useEffect } from 'react';

const ChatHeader = ({ recipientName, onBack, isConnected = true, lastSeen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);

  // Simulate typing indicator (you can replace this with actual socket events)
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setIsTyping(prev => Math.random() > 0.7 ? !prev : prev);
    }, 3000);
    
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    if (!isConnected) return 'bg-red-400';
    return 'bg-gradient-to-r from-[#B8E986] to-[#73C174]';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Offline';
    if (isTyping) return 'Typing...';
    return 'Online';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F0F0F0] via-[#9FD6E2] to-[#DCC6A0] opacity-20 animate-gradient-x"></div>
      
      {/* Main header container */}
      <div className="relative bg-white/95 backdrop-blur-lg border-b border-[#B8E986]/30 px-6 py-4 flex items-center justify-between shadow-lg">
        {/* Left section - Back button and user info */}
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="group relative p-3 rounded-2xl bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0] hover:from-[#9FD6E2] hover:to-[#B8E986] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#73C174] focus:ring-opacity-50"
              aria-label="Back to conversations"
            >
              <svg 
                className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              
              {/* Hover effect dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#73C174] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}

          {/* User avatar and info */}
          <div className="flex items-center space-x-4">
            {/* Animated avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B8E986] to-[#73C174] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform hover:rotate-12 transition-transform duration-300">
                {recipientName.charAt(0).toUpperCase()}
              </div>
              
              {/* Online status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full border-2 border-white shadow-lg animate-pulse`}></div>
            </div>

            {/* User info */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {recipientName}
                </h2>
                
                {/* Verification badge */}
                <div className="w-5 h-5 bg-gradient-to-br from-[#73C174] to-[#B8E986] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Status with typing animation */}
              <div className="flex items-center space-x-2">
                <div className={`text-sm font-medium ${
                  !isConnected ? 'text-red-500' : 
                  isTyping ? 'text-[#9FD6E2]' : 'text-[#73C174]'
                } transition-colors duration-300`}>
                  {getStatusText()}
                </div>
                
                {/* Typing animation */}
                {isTyping && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#9FD6E2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#9FD6E2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#9FD6E2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Time and actions */}
        <div className="flex items-center space-x-4">
          {/* Current time */}
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-600 bg-[#F0F0F0] px-3 py-1 rounded-full shadow-inner">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Local time
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {/* Video call button */}
            <button className="group p-3 rounded-xl bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0] hover:from-[#9FD6E2] hover:to-[#B8E986] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#73C174]">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Audio call button */}
            <button className="group p-3 rounded-xl bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0] hover:from-[#9FD6E2] hover:to-[#B8E986] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#73C174]">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>

            {/* More options button */}
            <button className="group p-3 rounded-xl bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0] hover:from-[#9FD6E2] hover:to-[#B8E986] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#73C174]">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar for typing indicator */}
      {isTyping && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8E986] to-[#9FD6E2] animate-pulse">
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;