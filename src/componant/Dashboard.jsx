import { useEffect, useState, useContext } from "react";
import { Search, Moon, Sun } from "lucide-react";
import axios from "axios";
import { Usercontext } from "./UsrProvider";
import { Link } from "react-router-dom";

import Nav from "./Nav";
import "./Home.css";
const API_URL = import.meta.env.VITE_API_URL;
const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] =
    useState("ALL");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });
  const { setuser } = useContext(Usercontext);
  const check_user = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/profile`, {
        withCredentials: true,
      });
      if (res.data.user) {
        setuser(res.data.user);
      }
    } catch (error) {
      console.log(error);
      // window.location.href = "/login";
    }
  };
  useEffect(() => {
    check_user();
    handleFetch();

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", !isDarkMode);
  };

  const handleFetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/problem`, {
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

  return (
    <>
      <Nav isDarkMode={isDarkMode} />
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
                <div
                  key={index}
                  className={`rounded-xl p-4 transition-all duration-300
                    backdrop-blur-lg border border-transparent
                    hover:shadow-xl hover:scale-[1.02]
                    ${
                      isDarkMode
                        ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                        : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
                    }`}
                >
                  <Link to={`/problem/${problem.id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {problem.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {problem.tags?.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className={`px-3 py-1 rounded-full text-sm backdrop-blur-lg
                                ${
                                  isDarkMode
                                    ? "bg-white bg-opacity-10 text-gray-100"
                                    : "bg-white bg-opacity-30 text-gray-900"
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
