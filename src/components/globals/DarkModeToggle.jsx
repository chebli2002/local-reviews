import { motion } from "framer-motion";
import { useTheme } from "../../data/ThemeContext.jsx";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/40 dark:bg-gray-900/60 backdrop-blur-md border border-white/40 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-500"
      whileTap={{ scale: 0.9, rotate: 15 }}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <motion.span
          key="moon"
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.5 }}
          className="block text-yellow-400 text-2xl"
        >
          🌙
        </motion.span>
      ) : (
        <motion.span
          key="sun"
          initial={{ opacity: 0, rotate: 90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: -90 }}
          transition={{ duration: 0.5 }}
          className="block text-indigo-600 text-2xl"
        >
          ☀️
        </motion.span>
      )}
    </motion.button>
  );
}
