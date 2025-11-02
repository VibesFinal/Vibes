import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ChatHeader = ({ recipientName = 'User', recipientId, onBack, isConnected = true, lastSeen, socket }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('userTyping', ({ userId }) => {
      if (userId === recipientId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off('userTyping');
    };
  }, [socket, recipientId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    if (!isConnected) return 'bg-red-400';
    return 'bg-gradient-to-r from-[#C05299] to-[#D473B3]';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Offline';
    if (isTyping) return 'Typing...';
    return 'Online';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const showConfirmation = (title, message, onConfirm, type = 'warning') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleOptionSelect = (optionId) => {
    console.log('Option selected:', optionId);
    // ... (your logic remains unchanged)
    switch (optionId) {
      case 'search': console.log('Search'); break;
      case 'mute':
        showConfirmation('Mute Notifications', 'Mute this chat?', () => console.log('Muted'), 'info');
        break;
      case 'wallpaper': console.log('Wallpaper'); break;
      case 'export':
        showConfirmation('Export Chat', 'Export as text?', () => console.log('Exported'), 'info');
        break;
      case 'clear':
        showConfirmation('Clear Chat', 'Clear all messages? Cannot be undone.', () => {
          if (socket) socket.emit('clearChatHistory', { recipientId });
        }, 'danger');
        break;
      case 'block':
        showConfirmation('Block User', `Block ${recipientName}?`, () => {
          if (socket) socket.emit('blockUser', { recipientId });
        }, 'danger');
        break;
      case 'report':
        showConfirmation('Report User', `Report ${recipientName}?`, () => {
          if (socket) socket.emit('reportUser', { recipientId });
        }, 'danger');
        break;
      default: break;
    }
  };

  const getInitial = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.charAt(0).toUpperCase();
  };

  const displayName = recipientName || 'User';

  return (
    <>
      <div className="relative">
        {/* Animated gradient background (keep subtle) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] opacity-5"></div>
        
        {/* Main header */}
        <div className="relative bg-white/95 backdrop-blur-lg border-b border-[#D473B3]/20 px-3 sm:px-5 py-3 flex items-center justify-between shadow-md">
          
          {/* Left: Back button + User info */}
          <div className="flex items-center min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                aria-label="Back"
                className="p-2.5 rounded-xl bg-gradient-to-br from-[#C05299] to-[#D473B3] hover:from-[#A8458A] hover:to-[#C05299] transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D473B3] focus:ring-opacity-50"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* User info */}
            <div className="flex items-center ml-2 min-w-0">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#C05299] via-[#D473B3] to-[#E8A5D8] rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md ring-2 ring-[#F5E1F0]">
                  {getInitial(displayName)}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 ${getStatusColor()} rounded-full border-2 border-white shadow-sm ${isConnected ? 'animate-pulse' : ''}`}></div>
              </div>

              <div className="ml-3 min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                  {displayName}
                </h2>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className={`text-xs sm:text-sm font-medium ${
                    !isConnected ? 'text-red-500' : 
                    isTyping ? 'text-[#D473B3]' : 'text-[#C05299]'
                  }`}>
                    {getStatusText()}
                  </span>
                  {isTyping && (
                    <div className="flex space-x-0.5">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D473B3] rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Time (hide on very small screens if needed) */}
          <div className="flex-shrink-0">
            <div className="text-xs sm:text-sm font-semibold bg-[#F5E1F0] text-[#C05299] px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default ChatHeader;