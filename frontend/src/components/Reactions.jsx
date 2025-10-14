import { motion } from "framer-motion";

const reactions = [
  { type: "like", emoji: "👍", label: "Support", color: "from-[#C05299] to-[#D473B3]" },
  { type: "love", emoji: "❤️", label: "Love", color: "from-[#C05299] to-[#D473B3]" },
  { type: "hug", emoji: "🤗", label: "Hug", color: "from-[#C05299] to-[#D473B3]" },
];

export default function ReactionButton({ reactionType, reactionCount, handleReaction }) {
  const totalReactions = Object.values(reactionCount || {}).reduce((a, b) => a + b, 0);
  const currentReaction = reactions.find((r) => r.type === reactionType);

  return (
    <div className="flex items-center justify-between">
      {/* Left Side: Reaction Button with Popup */}
      <div className="relative group">
        {/* Main React Button */}
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            reactionType
              ? `bg-gradient-to-r ${currentReaction?.color} text-white shadow-md`
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          }`}
        >
          {reactionType ? (
            <>
              <span className="text-base">{currentReaction?.emoji}</span>
              <span>{currentReaction?.label}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span>React</span>
            </>
          )}
        </button>

        {/* Reactions Popup */}
        <motion.div
          className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
          initial={false}
        >
          <div className="bg-white shadow-xl rounded-2xl border border-slate-200 p-2 flex gap-1">
            {reactions.map((r) => (
              <motion.button
                key={r.type}
                onClick={() => handleReaction(r.type)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  reactionType === r.type
                    ? `bg-gradient-to-br ${r.color} text-white shadow-md scale-105`
                    : "hover:bg-slate-50"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span
                  className={`text-xs font-medium ${
                    reactionType === r.type ? "text-white" : "text-slate-600"
                  }`}
                >
                  {r.label}
                </span>
                {reactionType === r.type && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <svg
                      className="w-3 h-3 text-[#C05299]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Popup Arrow */}
          <div className="w-3 h-3 bg-white border-r border-b border-slate-200 transform rotate-45 absolute left-6 -bottom-1.5"></div>
        </motion.div>
      </div>

      {/* Right Side: Reaction Counts */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-3">
          {reactions.map((r) => {
            const count = reactionCount[r.type] || 0;
            if (count === 0) return null;
            return (
              <motion.div
                key={r.type}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <span className="text-base">{r.emoji}</span>
                <span className="text-sm font-semibold text-slate-700">{count}</span>
              </motion.div>
            );
          })}
          <span className="text-xs text-slate-400 ml-1">
            {totalReactions} {totalReactions === 1 ? "reaction" : "reactions"}
          </span>
        </div>
      )}
    </div>
  );
}
