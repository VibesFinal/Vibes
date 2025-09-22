import React, { useState } from "react";

export default function InviteButton({ userId }) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/register?ref=${userId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-2 py-2 rounded-lg bg-cyan-400 text-white hover:bg-cyan-500 shadow-lg transition"
    >
      {copied ? "Link Copied!" : "Invite a Friend"}
    </button>
  );
}
