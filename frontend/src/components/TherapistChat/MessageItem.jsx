import React, { useState } from 'react';

const MessageItem = ({ message, isOwn, onDelete, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const content = message.content || message.message || '';
  const timestamp = message.created_at || message.timestamp || message.createdAt;
  const senderName = message.sender_name || message.senderName || message.username || 'User';
  const isEdited = message.is_edited || message.isEdited || false;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) onDelete(message.id);
    setShowDeleteModal(false);
  };

  const handleStartEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onEdit && editedContent.trim() !== content) onEdit(message.id, editedContent.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        className={`flex items-end gap-2 mb-3 ${isOwn ? 'flex-row-reverse ml-auto' : 'flex-row mr-auto'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar */}
        {!isOwn && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-[#F5E1F0]">
            {senderName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Message bubble */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
          {!isOwn && (
            <span className="text-xs font-semibold text-[#C05299] mb-1 ml-2">{senderName}</span>
          )}

          <div
            className={`relative px-5 py-3 rounded-3xl shadow-xl transition-all duration-300 ${
              isOwn
                ? 'bg-gradient-to-br from-[#C05299] via-[#D473B3] to-[#E8A5D8] text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md border-2 border-[#F5E1F0]'
            } ${isHovered ? 'shadow-2xl scale-105' : ''}`}
          >
            {isEditing ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-white text-[#C05299] rounded-lg text-sm font-semibold hover:bg-white/90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
                {content}
                {isEdited && (
                  <span className={`ml-2 text-xs italic ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                    (edited)
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Time + controls */}
          <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs text-gray-500 font-medium">{formatTime(timestamp)}</span>

            {isOwn && isHovered && !isEditing && (
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg">
                {onEdit && (
                  <button
                    onClick={handleStartEdit}
                    className="p-1.5 rounded-full hover:bg-blue-100 transition-colors"
                    title="Edit message"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="p-1.5 rounded-full hover:bg-red-100 transition-colors"
                    title="Delete message"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Avatar for self */}
        {isOwn && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-black font-bold text-sm shadow-lg ring-2 ring-[#F5E1F0]">
            You
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] rounded-t-3xl"></div>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">Delete Message?</h3>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageItem;
