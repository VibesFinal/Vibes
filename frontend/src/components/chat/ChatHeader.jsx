import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    onBack?.();
    navigate('/Community');
  };

  return (
    <div className="flex items-center justify-between mb-8 p-6 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-[#e9d5ff]/50 relative overflow-hidden">
      {/* Top accent gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C05299] to-[#D473B3]"></div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="relative px-6 py-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 text-[#1e293b] font-semibold group hover:-translate-x-1 border border-[#e9d5ff]/60 hover:border-[#C05299]/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[#C05299] group-hover:text-[#9333EA] transition-colors duration-300 group-hover:-translate-x-1"
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
        <span className="bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent">
          Back to Circles
        </span>
      </button>

      {/* Center Title */}
      <div className="text-center flex-1 mx-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent tracking-tight">
          Support Circle Chat
        </h1>
        <p className="text-sm text-[#64748b] mt-1 font-medium">
          💬 Safe space for meaningful conversations
        </p>
      </div>

      {/* Online Status Indicator */}
      <div className="flex items-center gap-3 bg-[#fdf2f8]/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-[#e9d5ff]/60">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-40"></div>
          </div>
          <span className="text-sm font-medium text-[#1e293b]">Live</span>
        </div>
        <div className="w-px h-4 bg-[#e9d5ff]/70"></div>
        <div className="text-xs text-[#C05299] font-medium">
          💜 Active
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;