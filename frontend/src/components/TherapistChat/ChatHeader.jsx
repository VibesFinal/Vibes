import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ChatHeader = ({ recipientName = 'User', recipientId, onBack, isConnected = true, lastSeen, socket }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  });

  // Simulate typing indicator
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
    
    switch (optionId) {
      case 'search':
        console.log('Search in conversation');
        break;
        
      case 'mute':
        showConfirmation(
          'Mute Notifications',
          'Do you want to mute notifications for this conversation?',
          () => {
            console.log('Notifications muted');
          },
          'info'
        );
        break;
        
      case 'wallpaper':
        console.log('Change wallpaper');
        break;
        
      case 'export':
        showConfirmation(
          'Export Chat',
          'Export this conversation as a text file?',
          () => {
            console.log('Chat exported');
          },
          'info'
        );
        break;
        
      case 'clear':
        showConfirmation(
          'Clear Chat History',
          'Are you sure you want to clear all messages? This action cannot be undone.',
          () => {
            if (socket) {
              socket.emit('clearChatHistory', { recipientId });
            }
            console.log('Chat cleared');
          },
          'danger'
        );
        break;
        
      case 'block':
        showConfirmation(
          'Block User',
          `Are you sure you want to block ${recipientName}? You will no longer receive messages from this user.`,
          () => {
            if (socket) {
              socket.emit('blockUser', { recipientId });
            }
            console.log('User blocked');
          },
          'danger'
        );
        break;
        
      case 'report':
        showConfirmation(
          'Report User',
          `Report ${recipientName} for inappropriate behavior?`,
          () => {
            if (socket) {
              socket.emit('reportUser', { recipientId });
            }
            console.log('User reported');
          },
          'danger'
        );
        break;
        
      default:
        break;
    }
  };

  // Safe function to get first character
  const getInitial = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.charAt(0).toUpperCase();
  };

  // Safe recipient name
  const displayName = recipientName || 'User';

  return (
    <>
      <div className="relative overflow">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] opacity-10 animate-gradient-x"></div>
        
        {/* Main header container */}
        <div className="relative bg-white/98 backdrop-blur-xl border-b border-[#D473B3]/20 px-6 py-4 flex items-center justify-between shadow-xl">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="group relative p-3 rounded-2xl bg-gradient-to-br from-[#C05299] to-[#D473B3] hover:from-[#A8458A] hover:to-[#C05299] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#D473B3]"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* User info */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C05299] via-[#D473B3] to-[#E8A5D8] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-2xl ring-4 ring-[#F5E1F0]">
                  {getInitial(displayName)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor()} rounded-full border-3 border-white shadow-xl ${isConnected ? 'animate-pulse' : ''}`}></div>
              </div>

              <div className="flex flex-col">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent">
                  {displayName}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-semibold ${!isConnected ? 'text-red-500' : isTyping ? 'text-[#D473B3]' : 'text-[#C05299]'}`}>
                    {getStatusText()}
                  </div>
                  {isTyping && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#D473B3] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#D473B3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#D473B3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent px-6 py-3 rounded-xl shadow-md bg-[#F5E1F0]">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
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
