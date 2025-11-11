import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from './EmojiPicker';

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isConnected = true,
  socket,
  recipientId,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiButtonRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(e.target) &&
        !emojiButtonRef.current?.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

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
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 40);
      textarea.style.height = newHeight + 'px';
      textarea.style.overflowY = 'hidden';
    }
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
    autoResize();
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
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
            fileData: reader.result,
          });
        };
        reader.readAsDataURL(file);
      }
      e.target.value = '';
    } catch (error) {
      console.error('Error sending file:', error);
      alert('Failed to send file.');
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    autoResize();
  }, [newMessage]);

  const quickReplies = ['Hello! 👋', 'How are you?', 'Thank you!', 'I understand.'];

  return (
    <div
      ref={containerRef}
      className="relative bg-gradient-to-t from-white via-[#FCF0F8] to-[#F5E1F0] border-t border-[#D473B3]/20 px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_-4px_8px_rgba(212,115,179,0.06)]"
    >
      {/* Connection indicator */}
      {!isConnected && (
        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1 shadow border border-red-200">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span>Connecting...</span>
          </div>
        </div>
      )}

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D473B3] to-transparent opacity-40"></div>

      <div className="max-w-4xl mx-auto w-full">
        {/* Emoji Picker - Positioned to the right */}
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2 z-50 w-full sm:w-80">
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-center gap-2 justify-center">
          {/* Textarea Container */}
          <div className="relative w-[65%] min-w-0 h-9">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
              disabled={!isConnected}
              className="w-full h-full pl-3 pr-20 py-2 bg-white/70 backdrop-blur-sm border border-[#D473B3]/30 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D473B3]/20 focus:border-[#D473B3] resize-none shadow-sm text-sm transition-all duration-200"
              style={{ 
                minHeight: '36px',
                maxHeight: '36px',
                height: '36px',
                lineHeight: '1.4',
                boxSizing: 'border-box'
              }}
              rows="1"
            />
            
            {/* Buttons inside textarea */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
             
              {/* Emoji Button */}
              <button
                ref={emojiButtonRef}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                disabled={!isConnected}
                className={`flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200 hover:bg-[#F8E9F3] focus:outline-none focus:ring-2 focus:ring-[#D473B3]/40 ${
                  showEmojiPicker
                    ? 'bg-gradient-to-br from-[#C05299] to-[#D473B3] text-white'
                    : 'text-[#C05299]'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                aria-label="Emoji"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
              disabled={!isConnected}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 font-medium text-white shadow hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: newMessage.trim() && isConnected
                ? 'linear-gradient(135deg, #C05299 0%, #D473B3 100%)'
                : '#E5E7EB',
            }}
            aria-label="Send message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Replies */}
      <div className="mt-2.5 sm:mt-3 overflow-x-auto hide-scrollbar">
        <div className="flex gap-1.5 min-w-max justify-center">
          {quickReplies.map((quickText) => (
            <button
              key={quickText}
              onClick={() => {
                setNewMessage(quickText);
                setTimeout(autoResize, 0);
                textareaRef.current?.focus();
              }}
              className="px-2.5 py-1 bg-white/60 hover:bg-gradient-to-r hover:from-[#F5E1F0] hover:to-[#F0D6EC] backdrop-blur-sm text-[#C05299] border border-[#D473B3]/20 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 shadow-sm hover:shadow"
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
  const styleId = 'message-input-scrollbar-compact';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
  }
}

export default MessageInput;