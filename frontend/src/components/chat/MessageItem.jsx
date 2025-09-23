// src/components/chat/MessageItem.jsx
import React, { useState } from 'react';

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
      <div key={msg.id} className="mb-4 p-3 text-center text-gray-400 italic text-sm">
        <em>This message was deleted</em>
      </div>
    );
  }

  return (
    <div
      key={msg.id}
      className={`mb-4 p-4 rounded-2xl max-w-xs sm:max-w-md relative group ${
        isOwnMessage
          ? 'bg-indigo-100 ml-auto text-indigo-900'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {/* Message Header */}
      <div className="flex justify-between text-xs mb-1 opacity-80">
        <span>{msg.senderName}</span>
        <span>
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {msg.edited_at && (
            <span className="ml-1 text-[10px] text-indigo-600">✏️</span>
          )}
        </span>
      </div>

      {/* Edit Mode */}
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows="2"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onSaveEdit(msg.id)}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Message Content */}
          <div className="break-words">{msg.message}</div>

          {/* Action Buttons (Own Messages Only) */}
          {isOwnMessage && (
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditMessage(msg)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded-full text-xs"
                title="Edit message"
              >
                ✏️
              </button>
              <button
                onClick={() => onDeleteMessage(msg.id)}
                className="p-1 text-red-600 hover:bg-red-100 rounded-full text-xs"
                title="Delete message"
              >
                🗑️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageItem;