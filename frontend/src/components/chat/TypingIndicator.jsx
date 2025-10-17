// src/components/chat/TypingIndicator.jsx
import React, { useState, useEffect } from 'react';

const TypingIndicator = ({ typingUsers }) => {
  const [visible, setVisible] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (typingUsers.size > 0) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300); // Smooth fade-out
      return () => clearTimeout(timer);
    }
  }, [typingUsers.size]);

  // Animate dots
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const typingUsersArray = Array.from(typingUsers);
  const isMultiple = typingUsers.size > 1;

  return (
    <div className="mb-6 animate-fade-in-up">
      <div className="relative">
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-2 left-6 w-4 h-4 bg-[#fdf2f8]/80 rotate-45 transform origin-center border-l border-b border-[#e9d5ff]"></div>

        {/* Main Indicator */}
        <div className="relative bg-gradient-to-br from-[#fdf2f8]/90 to-[#f5f3ff]/80 backdrop-blur-2xl rounded-2xl p-4 border border-[#e9d5ff]/60 shadow-lg">
          <div className="flex items-center gap-4">
            {/* Animated Typing Illustration */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#C05299] to-[#D473B3] rounded-2xl flex items-center justify-center shadow-md">
                <div className="relative">
                  <div className="w-2 h-2 bg-white rounded-full animate-typing-bounce [animation-delay:-0.3s] absolute -left-3"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-typing-bounce [animation-delay:-0.15s] absolute left-0"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-typing-bounce absolute left-3"></div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-ping"></div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[#1e293b] font-semibold text-sm">
                  {typingUsersArray.join(', ')}
                </span>
                <span className="text-[#64748b] text-sm">
                  {isMultiple ? 'are typing' : 'is typing'}
                  <span className="text-[#C05299] font-mono">{dots}</span>
                </span>
              </div>

              {/* Progress Animation */}
              <div className="w-full bg-[#e9d5ff]/40 rounded-full h-1.5 overflow-hidden mt-2">
                <div className="bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#C05299] h-1.5 rounded-full animate-progress-shimmer bg-[length:200%_100%]"></div>
              </div>
            </div>

            {/* Time Indicator */}
            <div className="text-xs text-[#64748b]/70 font-medium bg-white/60 px-2 py-1 rounded-full border border-[#e9d5ff]/50">
              now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;