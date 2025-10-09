import React, { useRef } from 'react';
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

  // Auto-scroll
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6 text-center">
        <div className="text-4xl mb-3 bg-gray-100 rounded-full p-4">💬</div>
        <p className="text-sm">Start a conversation with <span className="font-medium text-gray-700">{recipientName}</span></p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
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
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;