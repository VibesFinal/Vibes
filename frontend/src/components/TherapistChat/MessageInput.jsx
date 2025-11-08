import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from './EmojiPicker';

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage, isConnected = true, socket, recipientId }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (socket) {
        const reader = new FileReader();
        reader.onloadend = () => {
          socket.emit('sendPrivateFile', {
            recipientId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileData: reader.result
          });
        };
        reader.readAsDataURL(file);
      }
      console.log('File sent:', file.name);
    } catch (error) {
      console.error('Error sending file:', error);
      alert('Failed to send file.');
    }
  };

  useEffect(() => {
    autoResize();
  }, [newMessage]);

  const quickReplies = ['Hello! 👋', 'How are you?', 'Thank you!', 'I understand.'];

  return (
    <div className="relative bg-gradient-to-t from-white via-[#FCF0F8] to-[#F5E1F0] border-t border-[#D473B3]/30 px-3 py-3 sm:px-6 sm:py-5 shadow-lg">
      {/* Connection indicator */}
      {!isConnected && (
        <div className="absolute -top-9 left-0 right-0 flex justify-center z-10">
          <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 shadow-md border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Connecting...</span>
          </div>
        </div>
      )}

      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C05299] to-transparent opacity-50"></div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Main Input Row */}
      <div className="flex flex-col sm:flex-row items-end gap-2 sm:gap-3 max-w-4xl mx-auto w-full">
        {/* Action Buttons: Stacked on mobile */}
        <div className="flex sm:block gap-2 pb-1 sm:pb-0 space-x-2 sm:space-x-0 sm:space-y-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#D473B3] border ${
              showEmojiPicker
                ? 'bg-gradient-to-br from-[#C05299] to-[#D473B3] border-transparent'
                : 'bg-white border-[#D473B3]/20 hover:bg-[#F5E1F0]'
            }`}
            aria-label="Emoji"
          >
            <svg 
              className={`w-5 h-5 ${showEmojiPicker ? 'text-white' : 'text-[#C05299]'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Input + Send Button */}
        <div className="flex flex-1 gap-2 min-w-0 w-full">
          <div className="relative flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              disabled={!isConnected}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white/95 backdrop-blur-sm border-2 border-[#D473B3]/20 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D473B3] resize-none shadow-md text-sm sm:text-base min-w-0"
              style={{ minHeight: '44px', maxHeight: '100px' }}
            />

           
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="flex-shrink-0 p-2.5 rounded-xl font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12"
            style={{
              background: newMessage.trim() && isConnected
                ? 'linear-gradient(135deg, #C05299 0%, #D473B3 100%)'
                : '#E5E7EB'
            }}
            aria-label="Send message"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Replies */}
      <div className="mt-3 sm:mt-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 min-w-max justify-center">
          {quickReplies.map((quickText) => (
            <button
              key={quickText}
              onClick={() => setNewMessage(quickText)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#F5E1F0] hover:bg-gradient-to-r hover:from-[#C05299] hover:to-[#D473B3] text-[#C05299] hover:text-white border border-[#D473B3]/20 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200"
            >
              {quickText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Hide scrollbar for quick replies
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(style);
}

export default MessageInput;