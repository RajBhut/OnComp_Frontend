import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Plus, Moon, Sun } from "lucide-react";
import axios from "axios";
export default function PlayerState() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] =
    useState("ALL");
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", !isDarkMode);
  };
  const handleFetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/problem/solved`, {
        withCredentials: true,
      });
      setProblems(res.data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      EASY: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HARD: "bg-red-100 text-red-800",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficultyFilter === "ALL" ||
      problem.difficulty === selectedDifficultyFilter;
    return matchesSearch && matchesDifficulty;
  });
  useState(() => {
    handleFetch();
  });
  return (
    <>
      <div
        className={`min-h-screen transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white"
            : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 text-gray-900"
        } p-4 md:p-8`}
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">OnComp</h1>
            <div className="flex gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-3 theme-toggle hover:rotate-180 rounded-full shadow-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div
            className={`rounded-lg shadow-xl backdrop-blur-lg border border-transparent 
            transition-all duration-300 hover:shadow-2xl p-6
            ${
              isDarkMode
                ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                  ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none 
                    bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                    focus:border-white focus:border-opacity-30
                    ${isDarkMode ? "text-white" : "text-gray-900"}`}
                />
              </div>
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg outline-none
                  bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                  focus:border-white focus:border-opacity-30
                  ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                <option
                  className={`text-black ${
                    isDarkMode
                      ? "bg-purple-500 bg-opacity-10 hover:bg-opacity-20"
                      : "bg-teal-100 bg-opacity-20 hover:bg-opacity-30"
                  } `}
                  value="ALL"
                >
                  All Difficulties
                </option>
                <option
                  className={`text-black ${
                    isDarkMode
                      ? "bg-purple-500 bg-opacity-10 hover:bg-opacity-20"
                      : "bg-teal-100 bg-opacity-20 hover:bg-opacity-30"
                  } `}
                  value="EASY"
                >
                  Easy
                </option>
                <option
                  className={`text-black ${
                    isDarkMode
                      ? "bg-purple-500 bg-opacity-10 hover:bg-opacity-20"
                      : "bg-teal-100 bg-opacity-20 hover:bg-opacity-30"
                  } `}
                  value="MEDIUM"
                >
                  Medium
                </option>
                <option
                  className={`text-black ${
                    isDarkMode
                      ? "bg-purple-500 bg-opacity-10 hover:bg-opacity-20"
                      : "bg-teal-100 bg-opacity-20 hover:bg-opacity-30"
                  } `}
                  value="HARD"
                >
                  Hard
                </option>
              </select>
            </div>
            <div className="space-y-4">
              {filteredProblems.map((problem, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl p-6 transition-all duration-300
        backdrop-blur-lg border-l-4 shadow-lg
        ${
          isDarkMode
            ? "bg-white bg-opacity-10 hover:bg-opacity-15"
            : "bg-white bg-opacity-20 hover:bg-opacity-25"
        }
        ${
          problem.difficulty === "EASY"
            ? "border-green-400"
            : problem.difficulty === "MEDIUM"
            ? "border-yellow-400"
            : "border-red-400"
        }
      `}
                >
                  <Link to={`/problem/${problem.id}`}>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{problem.title}</h3>
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full
                  ${
                    problem.difficulty === "EASY"
                      ? "bg-green-400/20 text-green-400"
                      : problem.difficulty === "MEDIUM"
                      ? "bg-yellow-400/20 text-yellow-400"
                      : "bg-red-400/20 text-red-400"
                  }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {problem.tags?.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className={`px-3 py-1 rounded-full text-sm backdrop-blur-lg
                    ${
                      isDarkMode
                        ? "bg-white bg-opacity-5 text-gray-100"
                        : "bg-white bg-opacity-30 text-gray-900"
                    }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Success Rate:
                          </span>
                          <span
                            className={`font-bold ${
                              problem.successRate > 70
                                ? "text-green-400"
                                : problem.successRate > 40
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {problem.successRate || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
