import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  Code2Icon,
  UsersIcon,
  TrophyIcon,
  ArrowRightIcon,
  XIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const ComicBubbleVideoPopup = ({ videoUrl, onClose, isDarkMode }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -15, y: 50 }}
      animate={{ scale: 1, rotate: 0, y: 0 }}
      exit={{ scale: 0, rotate: 15, y: 50 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`absolute z-50 -top-20 left-0 transform -translate-x-1/2 w-80 h-56 bg-white rounded-2xl shadow-2xl border-4
        ${isDarkMode ? "border-purple-500 p-2" : " border-blue-500 p-2"} `}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        <XIcon size={24} />
      </button>
      <div className="w-full h-full">
        <iframe
          width="100%"
          height="100%"
          src={videoUrl}
          title="Tutorial Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture "
          allowFullScreen
          className="rounded-xl"
        ></iframe>
      </div>

      <div
        className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 ${
          isDarkMode ? "bg-purple-500" : "bg-blue-500"
        }`}
      ></div>
    </motion.div>
  );
};

const AnimatedBackground = ({ isDarkMode }) => {
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    const generateCircles = () => {
      const newCircles = Array.from({ length: 30 }, (_, index) => ({
        id: index,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 100 + 20,
        delay: Math.random() * 2,
        duration: Math.random() * 5 + 3,
      }));
      setCircles(newCircles);
    };

    generateCircles();
    const resizeHandler = () => generateCircles();
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className={`absolute rounded-full opacity-20 ${
            isDarkMode ? "bg-white/10" : "bg-black/10"
          }`}
          initial={{
            scale: 0,
            x: circle.x,
            y: circle.y,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: circle.size,
            height: circle.size,
          }}
        />
      ))}
    </div>
  );
};

const FeatureCard = ({ icon, title, description, videoUrl, isDarkMode }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  return (
    <div
      className="relative group rounded-2xl "
      onMouseEnter={() => setIsVideoVisible(true)}
      onMouseLeave={() => setIsVideoVisible(false)}
    >
      <div className="p-6 bg-white/10 backdrop-blur-lg">
        {!isVideoVisible && (
          <div
            className="absolute inset-0 bg-white/10 rounded-2xl"
            onClick={() => setIsVideoVisible(true)}
          ></div>
        )}
        <div className="mb-4 text-5xl text-center">{icon} </div>
        <h3 className="text-2xl font-bold mb-3 text-center text-white">
          {title}
        </h3>
        <p className="text-white/80 text-center">{description}</p>
      </div>

      <AnimatePresence>
        {isVideoVisible && (
          <ComicBubbleVideoPopup
            videoUrl={videoUrl}
            onClose={() => setIsVideoVisible(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <div
      className={`relative min-h-screen ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <AnimatedBackground isDarkMode={isDarkMode} />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container relative z-10 mx-auto px-4 py-16"
      >
        <motion.header
          className="flex justify-between items-center mb-16"
          variants={{
            hidden: { opacity: 0, y: -50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 100 },
            },
          }}
        >
          <motion.h1
            className="text-4xl font-black"
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}
          >
            oncomp
          </motion.h1>

          <motion.button
            whileHover={{
              scale: 1.1,
              rotate: 180,
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-lg ${
              isDarkMode ? "bg-yellow-400" : "bg-indigo-600"
            } text-white`}
          >
            {isDarkMode ? <SunIcon size={24} /> : <MoonIcon size={24} />}
          </motion.button>
        </motion.header>

        <motion.main className="text-center">
          <motion.h2
            className="text-6xl font-extrabold mb-6 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            Welcome to oncomp
          </motion.h2>

          <motion.p
            className="text-xl max-w-2xl mx-auto mb-12 text-white/90"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          >
            Your ultimate platform for online coding, collaboration, and
            continuous learning
          </motion.p>

          <motion.div
            className="grid md:grid-cols-3 gap-16 relative"
            variants={containerVariants}
          >
            <FeatureCard
              icon={<Code2Icon className="text-blue-400" />}
              title="Problem Solving"
              description="Master coding challenges with expert-designed problems"
              videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0"
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon={<UsersIcon className="text-green-400" />}
              title="Collaborative Learning"
              description="Connect, learn, and grow with a community of developers"
              videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0"
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon={<TrophyIcon className="text-purple-400" />}
              title="Code Challenges"
              description="Compete, improve skills, and track your coding progress"
              videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0"
              isDarkMode={isDarkMode}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16"
          >
            <Link to="/home">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xl font-bold rounded-full flex items-center mx-auto"
              >
                Get Started
                <ArrowRightIcon size={24} className="ml-3" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.main>
      </motion.div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default Home;
