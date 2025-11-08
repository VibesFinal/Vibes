import React, { useState, useRef, useEffect } from 'react';

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const pickerRef = useRef(null);
  
  const emojiCategories = {
    'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'],
    'Gestures': ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️'],
    'Objects': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️'],
    'Nature': ['🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🦞', '🦐', '🦑', '🐙', '🦪']
  };

  const [activeCategory, setActiveCategory] = useState('Smileys');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔧 Cleanup any existing emoji styles on unmount
  useEffect(() => {
    const cleanup = () => {
      const existing = document.getElementById('emoji-styles');
      if (existing) existing.remove();
    };
    return cleanup;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
  };

  const filteredEmojis = searchTerm
    ? Object.values(emojiCategories).flat().filter(emoji => 
        emoji.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : emojiCategories[activeCategory];

  return (
    <div 
      ref={pickerRef}
      className="fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-full sm:left-0 sm:w-80 bg-white/98 backdrop-blur-xl rounded-t-3xl sm:rounded-2xl shadow-2xl border-t-2 sm:border-2 border-[#D473B3]/30 z-50 sm:mt-2 animate-in fade-in zoom-in-95"
      style={{ maxHeight: '70vh', overflow: 'hidden' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F5E1F0] to-[#FCF0F8] p-4 border-b-2 border-[#D473B3]/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Pick an Emoji
          </h3>
          <button
            onClick={onClose}
            aria-label="Close emoji picker"
            className="p-1.5 rounded-lg hover:bg-[#D473B3]/20 transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-[#C05299]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Search emoji..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border-2 border-[#D473B3]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D473B3]"
        />
      </div>

      {/* Tabs */}
      {!searchTerm && (
        <div className="flex overflow-x-auto hide-scrollbar bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0] border-b-2 border-[#D473B3]/20 p-2 gap-2">
          {Object.keys(emojiCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-lg transition-colors ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white'
                  : 'bg-white text-[#C05299] hover:bg-[#F5E1F0]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid — ✅ FIXED FOR WINDOWS */}
      <div className="p-2 h-64 overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, index) => (
            <div
              key={`${emoji}-${index}`} // ✅ stable key
              onClick={() => handleEmojiClick(emoji)}
              aria-label={`Select ${emoji}`}
              // ✅ Critical: inline font + sizing
              style={{
                fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", sans-serif',
                fontSize: '1.5rem', // ~24px — avoids fractional scaling
                textAlign: 'center',
                padding: '0.5rem',
                cursor: 'pointer',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                minWidth: '2rem',
                minHeight: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="rounded-lg hover:bg-[#F5E1F0] active:scale-110 transition-transform"
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Recently used */}
      <div className="bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0] p-3 border-t-2 border-[#D473B3]/20">
        <p className="text-xs font-semibold text-[#C05299] mb-2">Recently Used</p>
        <div className="flex gap-2">
          {['😊', '❤️', '👍', '🎉', '😂'].map((emoji, index) => (
            <div
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              aria-label={`Select ${emoji}`}
              style={{
                fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", sans-serif',
                fontSize: '1.25rem',
                textAlign: 'center',
                padding: '0.5rem',
                cursor: 'pointer',
                minWidth: '2rem',
                minHeight: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="rounded-lg hover:bg-[#F5E1F0] active:scale-110"
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;