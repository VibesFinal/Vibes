import React, { useState, useRef } from 'react';

const ChatInput = ({ message, onMessageChange, onSendMessage, onTyping }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(e);
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    onMessageChange(value);
    onTyping(value);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end relative">
      {/* Main Input Container */}
      <div className="flex-1 relative z-10">
        <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Share your thoughts..."
            className="w-full px-6 py-4 pl-14 pr-20 bg-white/80 backdrop-blur-2xl border-2 border-[#e9d5ff] rounded-2xl focus:outline-none focus:border-[#C05299]/50 focus:ring-3 focus:ring-[#C05299]/20 transition-all duration-300 placeholder:text-[#64748b]/60 text-[#1e293b] shadow-lg hover:shadow-xl focus:shadow-2xl text-lg"
            autoComplete="off"
            spellCheck="true"
            maxLength="500"
          />

          {/* Character Count */}
          {message.length > 0 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div
                className={`text-xs font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                  message.length > 400
                    ? 'bg-red-100 text-red-600'
                    : 'bg-[#fdf2f8] text-[#C05299]'
                }`}
              >
                {message.length}/500
              </div>
            </div>
          )}

          {/* Input Icon */}
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#C05299]/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!message.trim()}
        className="relative z-10 px-6 py-4 bg-gradient-to-r from-[#C05299] to-[#D473B3] hover:from-[#9333EA] hover:to-[#C05299] disabled:from-gray-200 disabled:to-gray-300 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-sm disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:translate-y-0 flex items-center gap-2 group min-w-[100px]"
      >
        <span className="transition-transform duration-300 group-hover:scale-110">
          {!message.trim() ? '💜' : '🚀'}
        </span>
        <span className="whitespace-nowrap">
          {!message.trim() ? 'Wait' : 'Send'}
        </span>
      </button>
    </form>
  );
};

export default ChatInput;