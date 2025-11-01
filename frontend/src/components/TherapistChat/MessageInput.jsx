import React, { useState, useRef } from 'react';
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

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = async (file) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipientId', recipientId);

    try {
      // Send file through socket or API
      if (socket) {
        // Convert file to base64 for socket transmission
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
      
      // Or use API endpoint
      // const response = await axiosInstance.post('/api/upload-file', formData);
      
      console.log('File sent:', file.name);
    } catch (error) {
      console.error('Error sending file:', error);
      alert('Failed to send file. Please try again.');
    }
  };

  return (
    <div className="relative bg-gradient-to-t from-white via-[#FCF0F8] to-[#F5E1F0] border-t-2 border-[#D473B3]/30 px-6 py-5 shadow-2xl">
      {/* Connection status indicator with pink theme */}
      {!isConnected && (
        <div className="absolute -top-10 left-0 right-0 flex justify-center">
          <div className="bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xl border-2 border-red-200">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
            <span>Connecting...</span>
          </div>
        </div>
      )}

      {/* Decorative top border with pink gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C05299] through-[#D473B3] to-transparent opacity-60"></div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* Action buttons with pink theme */}
        <div className="flex flex-col gap-2.5 pb-2">

          {/* Emoji button */}
          <button
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
            }}
            className={`group p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#D473B3] border border-[#D473B3]/20 ${
              showEmojiPicker
                ? 'bg-gradient-to-br from-[#C05299] to-[#D473B3]'
                : 'bg-gradient-to-br from-[#F5E1F0] to-[#FCF0F8] hover:from-[#C05299] hover:to-[#D473B3]'
            }`}
            title="Add emoji"
          >
            <svg className={`w-5 h-5 transition-colors duration-200 ${
              showEmojiPicker ? 'text-white' : 'text-[#C05299] group-hover:text-white'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Message input container with pink gradient border */}
        <div className={`flex-1 relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
          {/* Animated border with pink gradient */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] transition-opacity duration-300 ${
            isFocused ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`} style={{ padding: '2px' }}>
            <div className="w-full h-full bg-white rounded-2xl"></div>
          </div>
          
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
            className="w-full px-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-[#D473B3]/20 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D473B3] resize-none shadow-lg transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed relative z-10"
            style={{ minHeight: '56px', maxHeight: '120px' }}
          />

          {/* Character counter with pink theme */}
          {newMessage.length > 0 && (
            <div className="absolute bottom-3 right-4 z-20">
              <div className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-md ${
                newMessage.length > 500 
                  ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' 
                  : 'bg-gradient-to-r from-[#F5E1F0] to-[#FCF0F8] text-[#C05299] border border-[#D473B3]/20'
              } transition-colors duration-200`}>
                {newMessage.length}/1000
              </div>
            </div>
          )}
        </div>

        {/* Send button with pink gradient */}
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || !isConnected}
          className="group relative px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D473B3] focus:ring-offset-2 shadow-xl disabled:shadow-md disabled:cursor-not-allowed overflow-hidden transform hover:scale-105"
          style={{
            background: newMessage.trim() && isConnected 
              ? 'linear-gradient(135deg, #C05299 0%, #D473B3 50%, #E8A5D8 100%)'
              : 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)'
          }}
        >
          {/* Hover shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          {/* Button content */}
          <div className="relative flex items-center space-x-2">
            {newMessage.trim() && isConnected ? (
              <>
                <span className="font-bold">Send</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                <span className="text-gray-500 font-bold">Send</span>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </div>

          {/* Pulse animation when active with pink gradient */}
          {newMessage.trim() && isConnected && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C05299] to-[#D473B3] opacity-0 group-hover:opacity-30 animate-ping"></div>
          )}
        </button>
      </div>

      {/* Quick actions bar with pink theme */}
      <div className="flex justify-center space-x-3 mt-4">
        {['Hello! 👋', 'How are you?', 'Thank you!', 'I understand.'].map((quickText) => (
          <button
            key={quickText}
            onClick={() => setNewMessage(quickText)}
            className="px-4 py-2 bg-gradient-to-br from-[#F5E1F0] to-[#FCF0F8] hover:from-[#C05299] hover:to-[#D473B3] text-[#C05299] hover:text-white border border-[#D473B3]/20 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
          >
            {quickText}
          </button>
        ))}
      </div>

      {/* Micro-animations */}
      <style>{`
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
