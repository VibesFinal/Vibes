import React, { useState, useRef } from 'react';

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage, isConnected = true }) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    // Auto-resize textarea
    if (e.key === 'Enter' && e.shiftKey) {
      setTimeout(() => {
        autoResize();
      }, 0);
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
    autoResize();
  };

  const handleAttachmentClick = () => {
    // Add attachment functionality here
    console.log('Attachment clicked');
  };

  const handleEmojiClick = () => {
    // Add emoji picker functionality here
    console.log('Emoji clicked');
  };

  return (
    <div className="relative bg-gradient-to-t from-white to-[#F0F0F0] border-t border-[#DCC6A0]/30 px-6 py-4 shadow-lg">
      {/* Connection status indicator */}
      {!isConnected && (
        <div className="absolute -top-8 left-0 right-0 flex justify-center">
          <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2 shadow-md">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Connecting...</span>
          </div>
        </div>
      )}

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B8E986] to-transparent opacity-50"></div>

      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* Action buttons */}
        <div className="flex flex-col gap-2 pb-2">
          {/* Attachment button */}
          <button
            onClick={handleAttachmentClick}
            className="group p-2.5 rounded-xl bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0] hover:from-[#9FD6E2] hover:to-[#B8E986] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#73C174]"
            title="Attach file"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Emoji button */}
          <button
            onClick={handleEmojiClick}
            className="group p-2.5 rounded-xl bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0] hover:from-[#9FD6E2] hover:to-[#B8E986] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#73C174]"
            title="Add emoji"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Message input container */}
        <div className={`flex-1 relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
          {/* Animated border */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-[#B8E986] to-[#9FD6E2] opacity-0 transition-opacity duration-300 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}></div>
          
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isConnected ? "Type your message... (Press Enter to send)" : "Connecting..."}
            disabled={!isConnected}
            rows="1"
            className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-transparent resize-none shadow-inner transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed relative z-10"
            style={{ minHeight: '56px', maxHeight: '120px' }}
          />

          {/* Character counter */}
          {newMessage.length > 0 && (
            <div className="absolute bottom-2 right-3 z-20">
              <div className={`text-xs px-2 py-1 rounded-full ${
                newMessage.length > 500 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-[#F0F0F0] text-gray-500'
              } transition-colors duration-200`}>
                {newMessage.length}/1000
              </div>
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || !isConnected}
          className="group relative px-5 py-4 rounded-2xl font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#73C174] focus:ring-offset-2 shadow-lg disabled:shadow-md disabled:cursor-not-allowed overflow-hidden"
          style={{
            background: newMessage.trim() && isConnected 
              ? 'linear-gradient(135deg, #B8E986 0%, #73C174 100%)'
              : 'linear-gradient(135deg, #F0F0F0 0%, #DCC6A0 100%)'
          }}
        >
          {/* Hover shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          {/* Button content */}
          <div className="relative flex items-center space-x-2">
            {newMessage.trim() && isConnected ? (
              <>
                <span>Send</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                <span className="text-gray-500">Send</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </div>

          {/* Pulse animation when active */}
          {newMessage.trim() && isConnected && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#B8E986] to-[#73C174] opacity-0 group-hover:opacity-30 animate-ping"></div>
          )}
        </button>
      </div>

      {/* Quick actions bar */}
      <div className="flex justify-center space-x-3 mt-3">
        {['Hello! 👋', 'How are you?', 'Thank you!', 'I understand.'].map((quickText) => (
          <button
            key={quickText}
            onClick={() => setNewMessage(quickText)}
            className="px-3 py-1.5 bg-[#F0F0F0] hover:bg-[#9FD6E2] text-gray-600 hover:text-gray-800 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 shadow-sm"
          >
            {quickText}
          </button>
        ))}
      </div>

      {/* Micro-animations */}
      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-gentle-pulse {
          animation: gentle-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MessageInput;