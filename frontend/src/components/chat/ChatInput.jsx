import React from 'react';

const ChatInput = ({ message, onMessageChange, onSendMessage, onTyping }) => {
  return (
    <form onSubmit={onSendMessage} className="flex gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => {
          const value = e.target.value;
          onMessageChange(value);
          onTyping(value);
        }}
        placeholder="Type your message..."
        className="flex-grow px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;