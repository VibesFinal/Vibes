// src/components/chat/MessageList.jsx
import React, { useRef } from 'react';
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

  // Auto-scroll
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20">
        <div className="text-5xl mb-4">💬</div>
        <p>No messages yet. Be the first to say hello!</p>
      </div>
    );
  }

  return (
    <>
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
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;