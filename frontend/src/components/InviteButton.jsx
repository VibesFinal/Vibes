import React, { useState } from "react";

export default function InviteButton({ userId }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inviteUrl = `${window.location.origin}/register?ref=${userId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);

    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Desktop Floating Button */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <button
          onClick={handleCopy}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea] to-[#a855f7] rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>

          {/* Icon */}
          <div className="relative">
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${copied ? 'scale-0' : 'scale-100'} ${isHovered ? 'rotate-12' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>

            {/* Checkmark for copied state */}
            <svg
              className={`w-5 h-5 absolute top-0 left-0 transition-transform duration-300 ${copied ? 'scale-100' : 'scale-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Text */}
          <span className="font-semibold whitespace-nowrap">
            {copied ? "Link Copied!" : "Invite Friends"}
          </span>

          {/* Floating Particles */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
        </button>

        {/* Tooltip */}
        <div className={`absolute bottom-full mb-3 right-0 px-3 py-2 bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white text-sm rounded-xl shadow-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Share Vibes with friends
          </div>
          <div className="absolute top-full right-4 w-2 h-2 bg-gradient-to-r from-[#9333ea] to-[#a855f7] rotate-45 border-r border-b border-white/10"></div>
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={handleCopy}
          className="group relative w-14 h-14 bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white rounded-2xl shadow-2xl shadow-purple-500/25 active:scale-95 transition-all duration-300"
        >
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${copied ? 'scale-0' : 'scale-100'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>

            {/* Checkmark for copied state */}
            <svg
              className={`w-6 h-6 absolute inset-0 m-auto transition-transform duration-300 ${copied ? 'scale-100' : 'scale-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Pulse Animation */}
          <div className="absolute inset-0 border-2 border-white rounded-2xl animate-ping opacity-0 group-hover:opacity-50"></div>
        </button>

        {/* Mobile Toast Notification */}
        {copied && (
          <div className="absolute bottom-full mb-3 right-0 px-4 py-3 bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white text-sm rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm animate-bounce-in">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Invite link copied!
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
