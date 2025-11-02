import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    onBack?.();
    navigate('/Community');
  };

  return (
    <div className="mb-6 w-full bg-white/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-lg border border-[#e9d5ff]/50 relative overflow-hidden p-4 sm:p-6">
      {/* Top accent gradient bar */}
      <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-[#C05299] to-[#D473B3]"></div>

      {/* Mobile: column | Desktop: row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Back Button — full width on mobile */}
        <button
          onClick={handleBack}
          className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-[#1e293b] font-semibold group border border-[#e9d5ff]/60 hover:border-[#C05299]/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-[#C05299] group-hover:text-[#9333EA] transition-colors duration-300"
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
          <span className="text-sm sm:text-base bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent whitespace-nowrap">
            Back to Circles
          </span>
        </button>

        {/* Title — centered, full width */}
        <div className="w-full text-center order-2">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent tracking-tight px-2">
            Support Circle Chat
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1 font-medium px-2">
            💬 Safe space for meaningful conversations
          </p>
        </div>

        {/* Status — centered on mobile, right on desktop */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end order-3">
          <div className="flex items-center gap-2 sm:gap-3 bg-[#fdf2f8]/70 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-[#e9d5ff]/60">
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping opacity-40"></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#1e293b] whitespace-nowrap">
                Live
              </span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-[#e9d5ff]/70"></div>
            <div className="text-[10px] sm:text-xs text-[#C05299] font-medium whitespace-nowrap">
              💜 Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;