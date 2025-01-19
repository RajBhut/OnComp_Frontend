import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  Code2Icon,
  UsersIcon,
  TrophyIcon,
  ArrowRightIcon,
} from "lucide-react";
import "./Home.css";
import { Link } from "react-router-dom";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div variants={itemVariants} className="feature-card">
      <motion.div
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          display: "inline-block",
        }}
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {icon}
      </motion.div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
}

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
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container"
      >
        <motion.header
          variants={itemVariants}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4rem",
          }}
        >
          <motion.h1
            style={{ fontSize: "2.25rem", fontWeight: 800 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            oncomp
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`theme-toggle ${isDarkMode ? "dark" : "light"}`}
          >
            {isDarkMode ? <SunIcon size={24} /> : <MoonIcon size={24} />}
          </motion.button>
        </motion.header>

        <motion.main variants={itemVariants}>
          <motion.h2
            className="main-title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
          >
            Welcome to oncomp
          </motion.h2>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.4 }}
          >
            Your go-to platform for online coding and collaboration
          </motion.p>

          <motion.div className="feature-grid" variants={containerVariants}>
            <FeatureCard
              icon={<Code2Icon size={40} />}
              title="Problem Solving"
              description="Solve Problem Created by Programers"
            />
            <FeatureCard
              icon={<UsersIcon size={40} />}
              title="Personalised Progress Tracking"
              description="Save Your Progress"
            />
            <FeatureCard
              icon={<TrophyIcon size={40} />}
              title="Code Challenges"
              description="Improve your skills with daily coding challenges and competitions"
            />
          </motion.div>

          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link to={"/"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`start-button ${isDarkMode ? "dark" : "light"}`}
              >
                Get Started
                <ArrowRightIcon size={24} style={{ marginLeft: "0.5rem" }} />
              </motion.button>
            </Link>
          </motion.div>
        </motion.main>
      </motion.div>
    </div>
  );
}

export default Home;
