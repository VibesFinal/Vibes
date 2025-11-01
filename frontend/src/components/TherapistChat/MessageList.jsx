import React, { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages = [], currentUserId, onDeleteMessage, onEditMessage }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

  // 🔄 Detect scroll position to show/hide button
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
      setIsUserNearBottom(isNearBottom);
    }
  };

  // 🔽 Scroll to bottom function
  const scrollToBottom = (behavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // ⏬ Scroll when new messages arrive only if user is near bottom
  useEffect(() => {
    if (isUserNearBottom) scrollToBottom('instant');
  }, [messages, isUserNearBottom]);

  // ⬇️ Initial scroll on mount
  useEffect(() => {
    scrollToBottom('instant');
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FCF0F8] via-white to-[#F5E1F0] opacity-50"></div>

      {/* Scrollable area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative h-full overflow-y-auto px-6 py-6 scroll-smooth flex flex-col"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D473B3 #F5E1F0',
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#C05299] to-[#D473B3] rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500 text-lg">Start the conversation by sending a message!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => {
                const messageSenderId = message.sender_id || message.senderId || message.from;
                const isOwn = messageSenderId === currentUserId;

                return (
                  <MessageItem
                    key={message.id || index}
                    message={message}
                    isOwn={isOwn}
                    onDelete={onDeleteMessage}
                    onEdit={onEditMessage}
                  />
                );
              })}
            </div>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-6 right-6 p-4 bg-gradient-to-br from-[#C05299] to-[#D473B3] text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-10 animate-bounce"
          title="Scroll to bottom"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* Custom scrollbar styles */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #F5E1F0;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #C05299, #D473B3);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #A8458A, #C05299);
        }
      `}</style>
    </div>
  );
};

export default MessageList;
