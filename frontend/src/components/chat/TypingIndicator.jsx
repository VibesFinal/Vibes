// src/components/chat/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.size === 0) return null;

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-2xl text-gray-600 text-sm italic">
      {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
    </div>
  );
};

export default TypingIndicator;