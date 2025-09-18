import { motion } from "framer-motion";          //this page is created for the reactions tailwind styling only

const reactions = [

  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "hug", emoji: "🤗" },

];

export default function ReactionButton({ reactionType, reactionCount, handleReaction }) {

  return (

    <div className="mt-4">
      <div className="relative group inline-block">
        {/* Main React Button */}
        <button
          className={`rounded-full bg-gray-100 px-5 py-2 text-sm font-medium shadow-sm transition-all
            ${reactionType ? "text-blue-600 bg-blue-50 scale-105" : "text-gray-600"} 
            hover:scale-110`}
        >
          {reactionType ? `You reacted: ${reactionType}` : "React"}
        </button>

        {/* Reactions Bar */}
        <motion.div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex gap-4 bg-white shadow-lg rounded-full px-4 py-2
                     opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all"
          initial={false}
        >
          {reactions.map((r, i) => (
            <motion.button
              key={r.type}
              onClick={() => handleReaction(r.type)}
              className={`text-2xl transition-transform 
                ${reactionType === r.type ? "scale-125" : "scale-100"} 
                hover:scale-150`}
              whileTap={{ scale: 0.85 }}
            >
              {r.emoji}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Counts under bar */}
      <div className="flex gap-6 mt-3 text-sm text-gray-600">
        <span>👍 {reactionCount.like || 0}</span>
        <span>❤️ {reactionCount.love || 0}</span>
        <span>🤗 {reactionCount.hug || 0}</span>
      </div>
    </div>
  );
}
