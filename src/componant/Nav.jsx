import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

function Nav({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ["Home", "YourCode", "Create", "Play", "Login"];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav>
      <div
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800"
            : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400"
        }`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={navVariants}
          className="hidden md:block"
        >
          <ul className="flex justify-center items-center max-w-6xl mx-auto">
            {navItems.map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className={`block px-6 py-4 font-bold transition-all duration-300
                    ${
                      isDarkMode
                        ? "text-white hover:bg-white/10"
                        : "text-gray-900 hover:bg-black/10"
                    }
                    relative group overflow-hidden`}
                >
                  <span className="relative z-10">{item}</span>
                  <motion.div
                    className={`absolute bottom-0 left-0 w-full h-0.5 ${
                      isDarkMode ? "bg-white" : "bg-gray-900"
                    }`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="md:hidden">
          <div className="flex justify-between items-center px-4">
            <Link
              to="/"
              className={`py-4 font-bold text-xl ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              oncomp
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-4 font-bold transition-all duration-300
                        ${
                          isDarkMode
                            ? "text-white hover:bg-white/10"
                            : "text-gray-900 hover:bg-black/10"
                        }`}
                    >
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
