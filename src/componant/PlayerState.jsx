import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ConstructionIcon, RefreshCwIcon } from "lucide-react";

export default function PlayerState() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "dark-mode" : "light-mode"
      } relative`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white/10 backdrop-blur-lg p-12 rounded-3xl shadow-2xl max-w-xl w- "
      >
        <ConstructionIcon className="mx-auto mb-6 text-blue-400" size={80} />

        <h1 className="text-5xl font-bold mb-4 text-white">
          Under Construction
        </h1>

        <p className="text-white/80 mb-8 text-xl">
          We're working hard to bring this feature to life. Stay tuned for
          Updates!
        </p>

        <div className="flex justify-center space-x-4">
          <Link to="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full"
            >
              <ArrowLeftIcon className="mr-2" />
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
