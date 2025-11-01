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
      {/* Compact Button for Dropdown */}
      <button
        onClick={handleCopy}
        className="w-full group relative flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-[1.02]"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea] to-[#a855f7] rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>

        {/* Icon */}
        <div className="relative">
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${copied ? 'scale-0' : 'scale-100'}`}
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
        <span className="font-semibold text-sm">
          {copied ? "Link Copied!" : "Invite Friends"}
        </span>
      </button>
    </>
  );
}
