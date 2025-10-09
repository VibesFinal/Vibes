import React from 'react';

const ChatHeader = ({ recipientName, onBack }) => {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-6 py-4 flex items-center shadow-md">
      {onBack && (
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Back"
        >
          ←
        </button>
      )}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{recipientName}</h2>
        <p className="text-sm text-green-500">Online</p>
      </div>
    </div>
  );
};

export default ChatHeader;