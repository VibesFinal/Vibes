// src/components/chat/MessageItem.jsx
import React from 'react';

const MessageItem = ({
  msg,
  currentUser,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onDeleteMessage,
  isEditing,
  editContent,
  setEditContent,
}) => {
  const isOwnMessage = msg.userId === currentUser.id;
  const isDeleted = msg.is_deleted;

  if (isDeleted) {
    return (
      <div key={msg.id} className="mb-6 p-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#fdf2f8]/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-[#e9d5ff]">
          <span className="text-[#C05299]/60 text-lg">💭</span>
          <span className="text-[#64748b]/70 text-sm italic font-medium">
            This message was deleted
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      key={msg.id}
      className={`mb-6 transition-all duration-300 transform hover:scale-[1.02] ${
        isOwnMessage ? 'ml-auto' : 'mr-auto'
      }`}
      style={{ maxWidth: 'min(28rem, 85vw)' }}
    >
      {/* Message Container */}
      <div
        className={`relative p-5 rounded-3xl backdrop-blur-2xl border-2 transition-all duration-300 group ${
          isOwnMessage
            ? 'bg-gradient-to-br from-[#fdf2f8] to-[#f5f3ff] border-[#e9d5ff]/60 shadow-lg hover:shadow-xl hover:border-[#C05299]/30'
            : 'bg-white/80 border-[#e9d5ff]/40 shadow-md hover:shadow-lg hover:border-[#e9d5ff]/60'
        }`}
      >
        {/* Message Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isOwnMessage
                  ? 'bg-gradient-to-r from-[#C05299] to-[#D473B3]'
                  : 'bg-[#e9d5ff]'
              }`}
            ></div>
            <span
              className={`text-sm font-semibold ${
                isOwnMessage
                  ? 'bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent'
                  : 'text-[#1e293b]'
              }`}
            >
              {isOwnMessage ? 'You' : msg.senderName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {msg.edited_at && (
              <span className="text-xs text-[#C05299] font-medium bg-[#fdf2f8] px-2 py-1 rounded-full border border-[#e9d5ff]">
                edited
              </span>
            )}
            <span className={`text-xs font-medium ${isOwnMessage ? 'text-[#64748b]' : 'text-[#64748b]/80'}`}>
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Edit Mode */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-4 bg-white/90 border-2 border-[#e9d5ff] rounded-2xl focus:outline-none focus:ring-3 focus:ring-[#C05299]/20 focus:border-[#C05299]/50 resize-none shadow-inner transition-all duration-300 text-[#1e293b] placeholder-[#64748b]/60"
              rows="3"
              autoFocus
              placeholder="Edit your message..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={onCancelEdit}
                className="px-4 py-2 bg-white/80 hover:bg-[#f5f3ff] text-[#1e293b] font-medium rounded-xl transition-all duration-300 border border-[#e9d5ff] hover:border-[#C05299]/30 hover:shadow-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => onSaveEdit(msg.id)}
                className="px-4 py-2 bg-gradient-to-r from-[#C05299] to-[#D473B3] hover:from-[#9333EA] hover:to-[#C05299] text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Message Content */}
            <div className={`text-lg leading-relaxed break-words ${isOwnMessage ? 'text-[#1e293b]' : 'text-[#1e293b]/90'}`}>
              {msg.message}
            </div>

            {/* Action Buttons (Own Messages Only) */}
            {isOwnMessage && (
              <div className="absolute -top-3 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => onEditMessage(msg)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-[#C05299] hover:bg-[#fdf2f8] rounded-xl transition-all duration-300 border border-[#e9d5ff] hover:border-[#C05299]/30 hover:shadow-lg hover:scale-110"
                  title="Edit message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteMessage(msg.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-300 hover:shadow-lg hover:scale-110"
                  title="Delete message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Message Corner Decoration */}
        <div
          className={`absolute bottom-2 ${
            isOwnMessage ? 'right-2' : 'left-2'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          <div className="text-[#C05299]/40 text-lg">{isOwnMessage ? '💜' : '💫'}</div>
        </div>
      </div>

      {/* Full timestamp on hover */}
      <div
        className={`text-xs text-[#64748b]/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isOwnMessage ? 'text-right pr-2' : 'text-left pl-2'
        }`}
      >
        {new Date(msg.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default MessageItem;