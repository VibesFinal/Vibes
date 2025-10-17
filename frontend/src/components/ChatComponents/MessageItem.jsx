import React, { useState } from 'react';

const MessageItem = ({
  msg,
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
  const [isHovered, setIsHovered] = useState(false);
  const isOwn = msg.sender_id === currentUserId;
  const displayName = isOwn ? 'You' : msg.username || recipientName;

  console.log('MessageItem Debug:', {
    msgId: msg.id,
    isOwn,
    currentUserId,
    senderId: msg.sender_id,
    editingMessageId
  });

  // Debug handlers
  const handleEditClick = (e) => {
    e.stopPropagation();
    console.log('Edit clicked for message:', msg.id);
    if (handleEditMessage) {
      handleEditMessage(msg);
    } else {
      console.error('handleEditMessage is not defined');
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    console.log('Delete clicked for message:', msg.id);
    if (handleDeleteMessage) {
      handleDeleteMessage(msg.id);
    } else {
      console.error('handleDeleteMessage is not defined');
    }
  }; // <- This closing brace was missing
  
  const handleSaveEditClick = (e) => {
    e.stopPropagation();
    console.log('Save edit clicked');
    if (handleSaveEdit) {
      handleSaveEdit();
    } else {
      console.error('handleSaveEdit is not defined');
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    console.log('Cancel edit clicked');
    if (setEditingMessageId) {
      setEditingMessageId(null);
    }
  };

  const containerClass = `max-w-[85%] ${isOwn ? 'ml-auto' : 'mr-auto'} mb-4 transition-all duration-300`;

  if (msg.is_deleted) {
    return (
      <div className={containerClass}>
        <div
          className={`px-5 py-3 rounded-3xl text-sm italic transition-all duration-300 ${
            isOwn
              ? 'bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0] text-gray-500 rounded-br-sm'
              : 'bg-gradient-to-br from-[#F0F0F0] to-[#9FD6E2] text-gray-500 rounded-bl-sm'
          } shadow-sm`}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>This message was deleted</span>
          </div>
        </div>
      </div>
    );
  }

  if (editingMessageId === msg.id) {
    return (
      <div className={containerClass}>
        {/* Editing indicator */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-[#73C174] rounded-full animate-pulse"></div>
          <span className="text-xs text-[#73C174] font-medium">Editing message...</span>
        </div>
        
        <div
          className={`px-6 py-4 rounded-3xl shadow-lg transform scale-105 transition-all duration-300 ${
            isOwn
              ? 'bg-gradient-to-br from-[#B8E986] to-[#73C174] text-white rounded-br-md'
              : 'bg-gradient-to-br from-[#9FD6E2] to-[#DCC6A0] text-gray-800 rounded-bl-md'
          }`}
        >
          <div className="text-xs font-semibold mb-3 opacity-90 flex items-center space-x-2">
            <span>{displayName}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Editing</span>
          </div>
          
          <textarea
            value={editContent}
            onChange={(e) => {
              e.stopPropagation();
              setEditContent(e.target.value);
            }}
            className={`w-full bg-transparent border-b focus:outline-none placeholder-opacity-70 text-sm mb-4 resize-none ${
              isOwn 
                ? 'border-white/30 placeholder-white/70' 
                : 'border-gray-600/30 placeholder-gray-600/70'
            }`}
            rows="3"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSaveEditClick(e);
              }
            }}
          />
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancelEdit}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isOwn
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-gray-600/20 text-gray-700 hover:bg-gray-600/30'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditClick}
              className="px-4 py-2 bg-gradient-to-r from-[#73C174] to-[#B8E986] text-white rounded-xl text-xs font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!editContent.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={containerClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sender name for others' messages */}
      {!isOwn && (
        <div className="text-xs font-semibold text-gray-600 mb-1.5 px-2">
          {displayName}
        </div>
      )}

      <div className="relative group">
        {/* Message bubble */}
        <div
          className={`px-6 py-4 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md ${
            isOwn
              ? 'bg-gradient-to-br from-[#B8E986] to-[#73C174] text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md border border-[#F0F0F0]'
          } ${isHovered ? 'transform scale-[1.02]' : ''}`}
        >
          {/* Message content */}
          <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {msg.content}
          </div>

          {/* Message footer */}
          <div className={`flex justify-between items-center mt-3 text-xs ${
            isOwn ? 'text-white/70' : 'text-gray-500'
          }`}>
            <div className="flex items-center space-x-2">
              <span>{new Date(msg.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
              {msg.is_edited && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isOwn ? 'bg-white/20' : 'bg-[#F0F0F0]'
                }`}>
                  edited
                </span>
              )}
            </div>

            {/* Action buttons - only show on hover for own messages */}
            {isOwn && (
              <div className={`flex items-center space-x-1 transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                {/* Edit button */}
                <button
                  onClick={handleEditClick}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isOwn 
                      ? 'hover:bg-white/20' 
                      : 'hover:bg-gray-100'
                  } transform hover:scale-110`}
                  title="Edit message"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {/* Delete button */}
                <button
                  onClick={handleDeleteClick}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isOwn 
                      ? 'hover:bg-white/20' 
                      : 'hover:bg-gray-100'
                  } transform hover:scale-110`}
                  title="Delete message"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;