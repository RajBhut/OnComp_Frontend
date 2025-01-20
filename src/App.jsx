import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";
import CodeEditor from "./componant/CodeEditor";
import Split from "react-split";
import { Moon, Sun } from "lucide-react";
import { useMediaQuery } from "react-responsive";
export default function App() {
  const [code, setCode] = useState(``);
  const [testCase, setTestCase] = useState("");
  const [testCode, setTestCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const CODE_API_URL = import.meta.env.VITE_CODE_API_URL;
  const isBigScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", !isDarkMode);
  };

  const LANGUAGES = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];
  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please enter some code");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        code: btoa(encodeURIComponent(code)),
        language: language.toLowerCase(),
      };

      const response = await axios.post(`${CODE_API_URL}/`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });

      setOutput(response.data);
    } catch (error) {
      console.error(error);
      setOutput("Error executing code");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, testCase, testCode]);

  const CODE_TEMPLATES = {
    javascript: `function solution() {\n  // Your code here\n}`,
    python: `class Run():\n    # Your code here\n    pass`,
    java: `public class Run {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white"
          : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 text-gray-900"
      }`}
    >
      <div className="container flex md:flex-col  min-w-full p-2 sm:p-4">
        {isBigScreen ? (
          <Split
            className="flex   lg:flex-row  gap-4 lg:gap-2"
            sizes={[50, 50]}
            direction="horizontal"
            gutterSize={8}
          >
            <div
              className={`rounded-lg   shadow-xl backdrop-blur-lg border border-transparent flex flex-col
                ${
                  isDarkMode
                    ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                    : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
                }`}
            >
              <div className="p-2  sm:p-4 space-y-4">
                <div className="flex   flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-bold">Code Input</h2>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-all duration-300
                      ${
                        isDarkMode
                          ? "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800"
                          : "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400"
                      } text-white`}
                  >
                    {isLoading ? "Running..." : "Run Code"}
                  </button>
                </div>

                <div className="grid  grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <button
                    onClick={toggleDarkMode}
                    className={`p-3  w-fit rounded-full shadow-lg transition-all duration-300 ${
                      isDarkMode
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    {isDarkMode ? (
                      <Sun className="max-w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>

                  <Link
                    to="/"
                    className={`px-4 py-2 rounded-lg text-center transition-all duration-300
                      backdrop-blur-lg border border-transparent
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                          : "bg-white bg-opacity-20 hover:bg-opacity-30"
                      }`}
                  >
                    Home
                  </Link>

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`px-4 py-2 rounded-lg outline-none
                      transition-all duration-300 backdrop-blur-lg border border-transparent
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                          : "bg-white bg-opacity-20 hover:bg-opacity-30"
                      }`}
                  >
                    {LANGUAGES.map((lang) => (
                      <option
                        className={`text-black ${
                          isDarkMode
                            ? "bg-purple-500 bg-opacity-10 hover:bg-opacity-20"
                            : "bg-teal-100 bg-opacity-20 hover:bg-opacity-30"
                        } `}
                        key={lang.value}
                        value={lang.value}
                      >
                        {lang.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setCode(CODE_TEMPLATES[language])}
                    className={`px-4 py-2 rounded-lg transition-all duration-300
                      backdrop-blur-lg border border-transparent
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                          : "bg-white bg-opacity-20 hover:bg-opacity-30"
                      }`}
                  >
                    Template
                  </button>
                </div>
              </div>

              <div className="flex border-b border-white border-opacity-20">
                {["code"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-2 sm:px-6 py-3 text-sm sm:text-base transition-all duration-300
                      ${
                        activeTab === tab
                          ? isDarkMode
                            ? "bg-white bg-opacity-10 border-b-2 border-white"
                            : "bg-white bg-opacity-30 border-b-2 border-white"
                          : "hover:bg-white hover:bg-opacity-10"
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-2 sm:p-6 flex-grow overflow-auto">
                <div
                  className={`w-full h-full rounded-lg overflow-hidden border border-transparent
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-5"
                          : "bg-white bg-opacity-10"
                      }`}
                >
                  <CodeEditor
                    handle_change={(e) => setCode(e)}
                    value={code}
                    launguage={language}
                    theme={isDarkMode ? "vs-dark" : "light"}
                  />
                </div>
              </div>
            </div>

            <div
              className={`rounded-lg shadow-xl backdrop-blur-lg border border-transparent flex flex-col
                ${
                  isDarkMode
                    ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                    : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
                }`}
            >
              <div
                className={`p-2 sm:p-4 ${
                  isDarkMode
                    ? "bg-white bg-opacity-10"
                    : "bg-white bg-opacity-20"
                }`}
              >
                <h2 className="text-xl font-bold">Output</h2>
              </div>
              <div className="p-2 sm:p-6 flex-grow overflow-auto">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Output will appear here..."
                  className={`w-full h-full p-4 rounded-lg outline-none resize-none
                    ${
                      isDarkMode
                        ? "bg-white bg-opacity-5"
                        : "bg-white bg-opacity-10"
                    }`}
                />
              </div>
            </div>
          </Split>
        ) : (
          <>
            <div className="flex flex-col  items-center   lg:flex-row  gap-4 lg:gap-2">
              <div
                className={`rounded-lg   shadow-xl backdrop-blur-lg border border-transparent flex w-full  flex-col
                ${
                  isDarkMode
                    ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                    : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
                }`}
              >
                <div className="p-2  sm:p-4 space-y-4">
                  <div className="flex   flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold">Code Input</h2>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-all duration-300
                      ${
                        isDarkMode
                          ? "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800"
                          : "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400"
                      } text-white`}
                    >
                      {isLoading ? "Running..." : "Run Code"}
                    </button>
                  </div>

                  <div className="grid  grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <button
                      onClick={toggleDarkMode}
                      className={`p-3  w-fit rounded-full shadow-lg transition-all duration-300 ${
                        isDarkMode
                          ? "bg-yellow-400 text-gray-900"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      {isDarkMode ? (
                        <Sun className="max-w-5 h-5" />
                      ) : (
                        <Moon className="w-5 h-5" />
                      )}
                    </button>

                    <Link
                      to="/"
                      className={`px-4 py-2 rounded-lg text-center transition-all duration-300
                      backdrop-blur-lg border border-transparent
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                          : "bg-white bg-opacity-20 hover:bg-opacity-30"
                      }`}
                    >
                      Home
                    </Link>

                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`px-4 py-2 rounded-lg outline-none
                      transition-all duration-300 backdrop-blur-lg border border-transparent
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                          : "bg-white bg-opacity-20 hover:bg-opacity-30"
                      }`}
                    >
                      {LANGUAGES.map((lang) => (
                        <option
                          className={`text-black ${
                            isDarkMode
                              ? "bg-purple-500 bg-opacity-10 hover:bg-opacity-20"
                              : "bg-teal-100 bg-opacity-20 hover:bg-opacity-30"
                          } `}
                          key={lang.value}
                          value={lang.value}
                        >
                          {lang.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setCode(CODE_TEMPLATES[language])}
                      className={`px-4 py-2 rounded-lg transition-all duration-300
                      backdrop-blur-lg border border-transparent
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                          : "bg-white bg-opacity-20 hover:bg-opacity-30"
                      }`}
                    >
                      Template
                    </button>
                  </div>
                </div>

                <div className="flex border-b border-white border-opacity-20">
                  {["code"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-2 sm:px-6 py-3 text-sm sm:text-base transition-all duration-300
                      ${
                        activeTab === tab
                          ? isDarkMode
                            ? "bg-white bg-opacity-10 border-b-2 border-white"
                            : "bg-white bg-opacity-30 border-b-2 border-white"
                          : "hover:bg-white hover:bg-opacity-10"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="p-2 sm:p-6 flex-grow overflow-auto">
                  <div
                    className={`w-full h-full rounded-lg overflow-hidden border border-transparent
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-5"
                          : "bg-white bg-opacity-10"
                      }`}
                  >
                    <CodeEditor
                      handle_change={(e) => setCode(e)}
                      value={code}
                      launguage={language}
                      theme={isDarkMode ? "vs-dark" : "light"}
                      map={false}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg w-full shadow-xl backdrop-blur-lg border border-transparent flex flex-col
                ${
                  isDarkMode
                    ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                    : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
                }`}
              >
                <div
                  className={`p-2 sm:p-4 ${
                    isDarkMode
                      ? "bg-white bg-opacity-10"
                      : "bg-white bg-opacity-20"
                  }`}
                >
                  <h2 className="text-xl font-bold">Output</h2>
                </div>
                <div className="p-2 sm:p-6 flex-grow overflow-auto">
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Output will appear here..."
                    className={`w-full h-full p-4 rounded-lg outline-none resize-none
                    ${
                      isDarkMode
                        ? "bg-white bg-opacity-5"
                        : "bg-white bg-opacity-10"
                    }`}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
