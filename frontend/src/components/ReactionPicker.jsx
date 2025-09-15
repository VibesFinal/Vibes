import React, { useState, useRef, useEffect } from "react";
import { playSound } from "../utils/playSound";
import "./ReactionPicker.css";

const REACTIONS = [
  { type: "inspire", emoji: "✨", color: "#FFD700", label: "Inspiring" },
  { type: "love", emoji: "❤️", color: "#FF3B30", label: "Love" },
  { type: "care", emoji: "🤗", color: "#FF9500", label: "Care" },
  { type: "strength", emoji: "💪", color: "#007AFF", label: "Strength" },
  { type: "hope", emoji: "🌈", color: "#34C759", label: "Hope" },
  { type: "empathy", emoji: "💜", color: "#5856D6", label: "Empathy" },
  { type: "hug", emoji: "🤝", color: "#FF2D55", label: "Support" }
];

// دالة لتوليد مفتاح فريد
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function ReactionPicker({
  reactions = {},
  userReaction,
  onReactionSelect,
  totalReactions = 0,
  postId,
  showCounts = false,
  size = "medium", // small, medium, large
  disabled = false
}) {
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  // العثور على الريأكشن المختار حالياً
  const selectedReaction = REACTIONS.find(r => r.type === userReaction);

  // تحديد أحجام المكونات حسب الحجم المطلوب
  const sizeClasses = {
    small: {
      button: "p-1 text-sm",
      emoji: "text-lg",
      counter: "text-xs"
    },
    medium: {
      button: "p-2 text-base",
      emoji: "text-xl",
      counter: "text-sm"
    },
    large: {
      button: "p-3 text-lg",
      emoji: "text-2xl",
      counter: "text-base"
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  // معالجة اختيار التفاعل مع تحسينات الأداء
  const handleReactionClick = async (reaction, event) => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    playSound();

    // الحصول على موضع الزر المضغوط
    const rect = event.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // حساب الموضع النسبي للأنيميشن
    const relativeX = rect.left - containerRect.left + rect.width / 2;
    const relativeY = rect.top - containerRect.top;

    // Floating emoji عند click مع موضع صحيح ومفتاح فريد
    setFloatingEmojis((prev) => [
      ...prev,
      { 
        id: generateUniqueId(),
        emoji: reaction.emoji,
        x: relativeX,
        y: relativeY
      }
    ]);

    try {
      // تحديد نوع التفاعل الجديد
      const newReactionType = userReaction === reaction.type ? null : reaction.type;
      
      // استدعاء دالة معالجة التفاعل
      await onReactionSelect(newReactionType);
      
      // إخفاء قائمة الريأكشن بعد الاختيار
      setShowReactions(false);
    } catch (error) {
      console.error("Error handling reaction:", error);
    } finally {
      setIsLoading(false);
    }

    // إزالة الأنيميشن بعد انتهائه
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.slice(1));
    }, 800);
  };

  // معالجة الضغط على الزر الرئيسي
  const handleMainButtonClick = async (event) => {
    if (disabled || isLoading) return;

    if (selectedReaction) {
      // إذا كان هناك ريأكشن مختار، قم بإلغائه
      setIsLoading(true);
      playSound();
      
      const rect = event.target.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = rect.left - containerRect.left + rect.width / 2;
      const relativeY = rect.top - containerRect.top;

      setFloatingEmojis((prev) => [
        ...prev,
        { 
          id: generateUniqueId(),
          emoji: selectedReaction.emoji,
          x: relativeX,
          y: relativeY
        }
      ]);

      try {
        await onReactionSelect(null);
      } catch (error) {
        console.error("Error removing reaction:", error);
      } finally {
        setIsLoading(false);
      }

      setTimeout(() => {
        setFloatingEmojis((prev) => prev.slice(1));
      }, 800);
    } else {
      // إذا لم يكن هناك ريأكشن، أظهر القائمة
      setShowReactions(!showReactions);
    }
  };

  // Particles عند hover مع موضع صحيح نسبة للحاوي
  const triggerParticles = (reaction, event) => {
    if (disabled) return;

    const rect = event.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const relativeX = rect.left - containerRect.left + rect.width / 2;
    const relativeY = rect.top - containerRect.top + rect.height / 2;

    const newParticles = Array.from({ length: 6 }).map(() => ({
      id: generateUniqueId(),
      color: reaction.color,
      x: relativeX + (Math.random() * 20 - 10),
      y: relativeY + (Math.random() * 20 - 10),
      dx: Math.random() * 40 - 20,
      dy: Math.random() * -40
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 600);
  };

  // حساب أعلى التفاعلات للعرض
  const topReactions = Object.entries(reactions)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center space-y-2">
      {/* الزر الرئيسي - يعرض الإيموجي المختار أو الافتراضي */}
      <div className="flex items-center space-x-2">
        <button
          className={`flex items-center space-x-1 rounded-full transition-all duration-200 reaction-button
            ${currentSize.button}
            ${selectedReaction 
              ? 'selected-reaction' 
              : 'bg-gray-100 hover:bg-gray-200'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            ${isLoading ? 'animate-pulse' : ''}
          `}
          onClick={handleMainButtonClick}
          onMouseEnter={() => !selectedReaction && !disabled && setShowReactions(true)}
          title={selectedReaction ? `Remove ${selectedReaction.label}` : "Add reaction"}
          style={selectedReaction ? { 
            backgroundColor: `${selectedReaction.color}20`,
            borderColor: selectedReaction.color,
            borderWidth: '2px'
          } : {}}
          disabled={disabled || isLoading}
        >
          <span className={currentSize.emoji}>
            {selectedReaction ? selectedReaction.emoji : '😊'}
          </span>
          {totalReactions > 0 && (
            <span className={`font-medium text-gray-700 ${currentSize.counter}`}>
              {totalReactions}
            </span>
          )}
        </button>

        {/* عرض أعلى التفاعلات إذا كان showCounts مفعل */}
        {showCounts && topReactions.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            {topReactions.map(([reactionType, count]) => {
              const reaction = REACTIONS.find(r => r.type === reactionType);
              return reaction ? (
                <span key={reactionType} className="flex items-center space-x-1">
                  <span>{reaction.emoji}</span>
                  <span>{count}</span>
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* أزرار الريأكشن - تظهر فقط عند الحاجة */}
      {showReactions && !selectedReaction && !disabled && (
        <div 
          className="flex space-x-3 bg-white p-3 rounded-2xl shadow-lg border reactions-list backdrop-blur-sm"
          onMouseLeave={() => setShowReactions(false)}
        >
          {REACTIONS.map((r) => (
            <button
              key={r.type}
              className={`p-2 rounded-full hover:bg-gray-200 transition-all duration-200 reaction-button hover:scale-110 ${currentSize.button}`}
              onClick={(e) => handleReactionClick(r, e)}
              onMouseEnter={(e) => {
                setHoveredReaction(r);
                triggerParticles(r, e);
              }}
              onMouseLeave={() => setHoveredReaction(null)}
              title={r.label}
              disabled={isLoading}
            >
              <span className={currentSize.emoji}>{r.emoji}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tooltip محسن */}
      {hoveredReaction && showReactions && (
        <div className="absolute -bottom-10 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg reaction-tooltip">
          <div className="font-medium">{hoveredReaction.label}</div>
          {reactions[hoveredReaction.type] > 0 && (
            <div className="text-gray-300">
              {reactions[hoveredReaction.type]} reactions
            </div>
          )}
        </div>
      )}

      {/* عرض تفصيلي للتفاعلات إذا كان هناك تفاعلات متعددة */}
      {totalReactions > 1 && selectedReaction && (
        <div className="text-xs text-gray-500 text-center">
          You and {totalReactions - 1} others reacted
        </div>
      )}

      {/* Floating Emojis مع موضع صحيح ومفاتيح فريدة */}
      {floatingEmojis.map((f) => (
        <span
          key={f.id}
          className="absolute text-3xl animate-float pointer-events-none"
          style={{ 
            left: `${f.x}px`, 
            top: `${f.y}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}
        >
          {f.emoji}
        </span>
      ))}

      {/* Particles مع موضع صحيح ومفاتيح فريدة */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none animate-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            backgroundColor: p.color,
            transform: 'translate(-50%, -50%)',
            zIndex: 999,
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`
          }}
        />
      ))}
    </div>
  );
}
