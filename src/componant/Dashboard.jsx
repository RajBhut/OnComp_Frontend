import React, { useEffect, useState } from "react";
import { Search, Plus, Moon, Sun } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Nav from "./Nav";
import CreateProblem from "./CreateProblem ";

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] =
    useState("ALL");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
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

  const handleSubmit = async (problemData) => {
    try {
      await axios.post(`${API_URL}/problem`, problemData, {
        withCredentials: true,
      });
      setIsFormVisible(false);
      handleFetch();
    } catch (error) {
      console.error("Error submitting problem:", error);
    }
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
      <Nav />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              OnComp
            </h1>
            <div className="flex gap-4">
              <Link
                className="text-white bg-blue-600 flex justify-center items-center hover:bg-blue-700 px-4 py-2 rounded-lg"
                to={"/home"}
              >
                Playground
              </Link>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredProblems.map((problem, index) => (
                <div
                  key={index}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold dark:text-white">
                        {problem.title}
                      </h3>
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags?.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm dark:bg-gray-700 dark:text-gray-200"
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
