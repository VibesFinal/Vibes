import React, { useState, useRef, useEffect } from 'react';

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const pickerRef = useRef(null);
  
  // Emoji categories with pink theme
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

  // Close picker when clicking outside
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
    ? Object.values(emojiCategories).flat().filter(emoji => emoji.includes(searchTerm))
    : emojiCategories[activeCategory];

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-20 left-0 w-80 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-[#D473B3]/30 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95"
    >
      {/* Header with pink gradient */}
      <div className="bg-gradient-to-r from-[#F5E1F0] to-[#FCF0F8] p-4 border-b-2 border-[#D473B3]/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent">
            Pick an Emoji
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#D473B3]/20 transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-[#C05299]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search emoji..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-white border-2 border-[#D473B3]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D473B3] text-sm"
        />
      </div>

      {/* Category tabs */}
      {!searchTerm && (
        <div className="flex overflow-x-auto bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0] border-b-2 border-[#D473B3]/20 p-2 gap-2">
          {Object.keys(emojiCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white shadow-lg'
                  : 'bg-white text-[#C05299] hover:bg-[#F5E1F0]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="p-3 h-64 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-8 gap-2">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl p-2 rounded-lg hover:bg-gradient-to-br hover:from-[#F5E1F0] hover:to-[#FCF0F8] transition-all duration-200 transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Recently used section (optional) */}
      <div className="bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0] p-3 border-t-2 border-[#D473B3]/20">
        <p className="text-xs font-semibold text-[#C05299] mb-2">Recently Used</p>
        <div className="flex gap-2">
          {['😊', '❤️', '👍', '🎉', '😂'].map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="text-xl p-2 rounded-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
