// src/components/chat/ChatHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    onBack?.();
    navigate('/Community');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 text-gray-700 font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Communities
      </button>
      <h1 className="text-2xl font-bold text-gray-800">Community Chat</h1>
      <div></div>
    </div>
  );
};

export default ChatHeader;