// src/components/chat/MessageList.jsx
import React, { useRef, useEffect, useState } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({
  messages,
  currentUser,
  editingMessageId,
  editContent,
  setEditContent,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onDeleteMessage,
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  }, [messages, editingMessageId]);

  // Show scroll button when user scrolls up
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-8 bg-[#C05299]/10 rounded-full blur-2xl"></div>
          <div className="relative text-6xl mb-4 animate-bounce">💬</div>
        </div>

        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent mb-3">
          Welcome to the Circle
        </h3>
        <p className="text-[#64748b] text-lg max-w-md leading-relaxed mb-6">
          No messages yet. Be the first to start this meaningful conversation!
        </p>

        <div className="flex gap-3 text-sm text-[#64748b]/70">
          <div className="flex items-center gap-1 bg-[#fdf2f8]/80 px-3 py-2 rounded-xl border border-[#e9d5ff]">
            <div className="w-2 h-2 bg-[#C05299] rounded-full animate-pulse"></div>
            <span>Safe space</span>
          </div>
          <div className="flex items-center gap-1 bg-[#f5f3ff]/80 px-3 py-2 rounded-xl border border-[#e9d5ff]">
            <div className="w-2 h-2 bg-[#9333EA] rounded-full animate-pulse"></div>
            <span>Be kind</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#e9d5ff] scrollbar-track-transparent scrollbar-thumb-rounded-full pr-2 -mr-2"
      >
        <div className="pt-16">
          {/* Date Separator */}
          <div className="flex items-center justify-center my-8">
            <div className="bg-gradient-to-r from-[#f5f3ff] to-[#fdf2f8] px-4 py-2 rounded-2xl border border-[#e9d5ff]">
              <span className="text-sm font-medium text-[#1e293b]">Today</span>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-1 pb-4">
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                msg={msg}
                currentUser={currentUser}
                isEditing={editingMessageId === msg.id}
                editContent={editContent}
                setEditContent={setEditContent}
                onEditMessage={onEditMessage}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onDeleteMessage={onDeleteMessage}
              />
            ))}
          </div>

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-[#C05299] to-[#D473B3] hover:from-[#9333EA] hover:to-[#C05299] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-[#e9d5ff]/50 backdrop-blur-sm"
          title="Scroll to bottom"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* New Message Indicator */}
      {showScrollButton && (
        <div className="absolute bottom-16 right-4 bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white px-3 py-2 rounded-2xl shadow-lg animate-pulse">
          <span className="text-sm font-medium">New messages</span>
        </div>
      )}

      {/* Online Status Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-b-2xl border border-[#e9d5ff]/50 border-t-0 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-[#1e293b]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">{messages.length} messages</span>
            </div>
            <div className="w-1 h-1 bg-[#e9d5ff] rounded-full"></div>
            <span className="text-[#64748b]/80">Active now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;