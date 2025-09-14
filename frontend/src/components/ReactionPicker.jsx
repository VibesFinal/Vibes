import React, { useState, useRef, useEffect } from 'react';


const REACTIONS = [
  { type: 'inspire', emoji: '🌟'},
  { type: 'love', emoji: '❤️' },
  { type: 'care', emoji: '🤗' },
  { type: 'strength', emoji: '💪' },
  { type: 'hope', emoji: '😊' },
  { type: 'empathy', emoji: '😢' },
  { type: 'hug', emoji: '🫂' }
];

const ReactionPicker = ({ 
  reactions = {}, 
  userReaction = null, 
  onReactionSelect, 
  totalReactions = 0,
  showCounts = true 
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReactionClick = (reactionType) => {
    if (userReaction === reactionType) {
      // Remove reaction if clicking the same one
      onReactionSelect(null);
    } else {
      // Add or change reaction
      onReactionSelect(reactionType);
    }
    setShowPicker(false);
  };

  const handleMainButtonClick = () => {
    if (userReaction) {
      // If user has a reaction, remove it
      onReactionSelect(null);
    } else {
      // If no reaction, show picker
      setShowPicker(!showPicker);
    }
  };

  const getUserReactionData = () => {
    return REACTIONS.find(r => r.type === userReaction);
  };

  const getTopReactions = () => {
    return REACTIONS
      .filter(r => reactions[r.type] > 0)
      .sort((a, b) => reactions[b.type] - reactions[a.type])
      .slice(0, 3);
  };

  return (
    <div className="relative inline-block">
      {/* Main reaction button */}
      <button
        ref={buttonRef}
        className={`flex items-center rounded-md text-sm font-sm transition-colors duration-200
          ${userReaction ? 'bg-red text-blue' :' text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'}
        `}
        onClick={handleMainButtonClick}
        onMouseEnter={() => setShowPicker(true)}
        onMouseLeave={() => setTimeout(() => setShowPicker(false), 10000)}
      >
        {userReaction ? (
          <>
            <span className="mr-1 text-lg">
              {getUserReactionData()?.emoji}
            </span>
            <span>
              {getUserReactionData()?.label}
            </span>
          </>
        ) : (
          <>
            <span className="mr-1 text-lg">💠</span>
            <span>react</span>
          </>
        )}
      </button>

      {/* Reaction counts display */}
      {showCounts && totalReactions > 0 && (
        <div className="flex items-center ml-2 text-gray-500 text-sm">
          <div className="flex -space-x-1 overflow-hidden">
            {getTopReactions().map((reaction, index) => (
              <span key={reaction.type} className="inline-block h-5 w-5 rounded-full ring-2 ring-white text-center text-xs leading-5">
                {reaction.emoji}
              </span>
            ))}
          </div>
          <span className="ml-1 text-gray-700">{totalReactions}</span>
        </div>
      )}

      {/* Reaction picker popup */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white rounded-full shadow-lg flex items-center space-x-1 transition-all duration-300 ease-out"
          onMouseEnter={() => setShowPicker(true)}
          onMouseLeave={() => setShowPicker(false)}
        >
          {REACTIONS.map((reaction) => (
            <button
              key={reaction.type}
              className={`group relative p-2 rounded-full hover:bg-gray-200 transition-colors duration-200
                ${userReaction === reaction.type ? 'bg-blue-100' : ''}
              `}
              onClick={() => handleReactionClick(reaction.type)}
              onMouseEnter={() => setHoveredReaction(reaction)}
              onMouseLeave={() => setHoveredReaction(null)}
              title={reaction.label}
            >
              <span className="text-2xl">
                {reaction.emoji}
              </span>
            </button>
          ))}
          
          {/* Tooltip */}
          {hoveredReaction && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {hoveredReaction.label}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;
