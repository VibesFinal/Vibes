import { motion } from "framer-motion";

export default function FloatingEmoji({ emoji, x, y, onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -80 }}
      transition={{ duration: 1 }}
      onAnimationComplete={onComplete}
      className="absolute pointer-events-none select-none text-2xl"
      style={{ left: x, top: y }}
    >
      {emoji}
    </motion.div>
  );
}
