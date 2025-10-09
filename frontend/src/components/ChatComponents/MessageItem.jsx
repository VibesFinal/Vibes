import React from 'react';

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
  const isOwn = msg.sender_id === currentUserId;
  const displayName = isOwn ? 'You' : msg.username || recipientName;

  const containerClass = `max-w-[80%] ${isOwn ? 'ml-auto' : 'mr-auto'} mb-3`;

  if (msg.is_deleted) {
    return (
      <div className={containerClass}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-xs italic ${
            isOwn
              ? 'bg-blue-100 text-blue-800 rounded-br-none'
              : 'bg-gray-200 text-gray-600 rounded-bl-none'
          }`}
        >
          This message was deleted.
        </div>
      </div>
    );
  }

  if (editingMessageId === msg.id) {
    return (
      <div className={containerClass}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-transparent border-b border-white/30 focus:outline-none placeholder-white/70 text-sm mb-3"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSaveEdit}
              className="text-xs font-medium bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditingMessageId(null)}
              className="text-xs font-medium bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div
        className={`px-4 py-3 rounded-2xl ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none shadow-md'
        }`}
      >
        <div className="text-xs font-semibold mb-1 opacity-90">{displayName}</div>
        <div className="text-sm mb-2 leading-relaxed break-words">{msg.content}</div>
        <div className="flex justify-between items-center text-[11px] text-gray-300">
          <span>
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {msg.is_edited && <span className="ml-1">(edited)</span>}
          </span>
          {isOwn && (
            <div className="flex gap-2">
              <button
                onClick={() => handleEditMessage(msg)}
                className="hover:text-white transition"
              >
                Edit
              </button>
              <span>•</span>
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="hover:text-red-300 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem