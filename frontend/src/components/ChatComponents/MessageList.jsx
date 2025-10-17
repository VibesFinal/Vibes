import React, { useRef, useEffect, useState } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({
  messages,
  currentUserId,
  recipientName,
  editingMessageId,
  editContent,
  setEditContent,
  handleSaveEdit,
  setEditingMessageId,
  handleEditMessage,
  handleDeleteMessage,
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if user is at the bottom of the messages
  const checkScrollPosition = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(distanceFromBottom <= 100);
    setShowScrollButton(distanceFromBottom > 300);
  };

  // Auto-scroll to bottom when new messages arrive and user is at bottom
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: messages.length > 10 ? 'smooth' : 'auto' 
      });
    }
  }, [messages, isAtBottom]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
    setShowScrollButton(false);
  };

  // Handle scroll events
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  // New message notification
  const getNewMessageCount = () => {
    // This would typically come from your state management
    // For now, we'll simulate it
    return Math.min(messages.filter(msg => 
      msg.sender_id !== currentUserId && 
      !msg.is_deleted
    ).length, 99);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#B8E986] rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#9FD6E2] rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-[#DCC6A0] rounded-full blur-xl"></div>
        </div>

        <div className="relative flex flex-col items-center justify-center h-full text-gray-500 px-6 text-center">
          {/* Animated icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#B8E986] to-[#9FD6E2] rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl transform hover:rotate-12 transition-transform duration-500">
              💬
            </div>
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#73C174] rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#DCC6A0] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-700 mb-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Start the Conversation
          </h3>
          <p className="text-gray-600 max-w-md leading-relaxed">
            Begin your journey with <span className="font-semibold text-[#73C174]">{recipientName}</span>. 
            Share your thoughts, ask questions, or simply say hello to start building your therapeutic relationship.
          </p>
          
          {/* Decorative dots */}
          <div className="flex space-x-2 mt-6">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className="w-2 h-2 bg-gradient-to-r from-[#B8E986] to-[#9FD6E2] rounded-full animate-pulse"
                style={{ animationDelay: `${dot * 0.3}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden relative">
      {/* Gradient overlay at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-6 right-6 z-20 group"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#B8E986] to-[#73C174] rounded-2xl shadow-2xl flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            
            {/* New message count badge */}
            {getNewMessageCount() > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                {getNewMessageCount()}
              </div>
            )}
            
            {/* Tooltip */}
            <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Scroll to latest
            </div>
          </div>
        </button>
      )}

      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="h-full overflow-y-auto scroll-smooth px-6 py-8 space-y-6 custom-scrollbar"
        onScroll={checkScrollPosition}
      >
        {/* Date separator example - you can implement proper date grouping */}
        {messages.length > 0 && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-4 px-4 py-2 bg-gradient-to-r from-[#F0F0F0] to-[#DCC6A0] rounded-full">
              <div className="w-2 h-2 bg-[#73C174] rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">
                {new Date(messages[0].created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <div className="w-2 h-2 bg-[#73C174] rounded-full"></div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className="message-enter"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <MessageItem
              msg={msg}
              currentUserId={currentUserId}
              recipientName={recipientName}
              editingMessageId={editingMessageId}
              editContent={editContent}
              setEditContent={setEditContent}
              handleSaveEdit={handleSaveEdit}
              setEditingMessageId={setEditingMessageId}
              handleEditMessage={handleEditMessage}
              handleDeleteMessage={handleDeleteMessage}
            />
          </div>
        ))}
        
        {/* Bottom spacer for auto-scroll */}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Connection status bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-[#B8E986]/20">
          <div className="w-2 h-2 bg-[#73C174] rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-600">
            Connected to {recipientName}
          </span>
        </div>
      </div>

      {/* Loading more messages indicator (optional) */}
      {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
          <div className="w-4 h-4 border-2 border-[#B8E986] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-gray-600">Loading more messages...</span>
        </div>
      </div> */}
    </div>
  );
};

export default MessageList;