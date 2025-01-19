import React, { useState, useRef, useEffect, useContext } from "react";
import { Usercontext } from "./UsrProvider";
import axios from "axios";
import "../App.css";
import { Link, useLocation } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import Split from "react-split";
import { Moon, Sun } from "lucide-react";

export default function ProblemAdder() {
  const API_URL = import.meta.env.VITE_API_URL;
  const CODE_API_URL = import.meta.env.VITE_CODE_API_URL;
  const [isfatched, setisfatched] = useState(false);
  const { setuser, user } = useContext(Usercontext);
  const [code, setCode] = useState(``);
  const [testCase, setTestCase] = useState("");
  const [testCode, setTestCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const location = useLocation();
  const problem = location.state;
  const [fetched_data, setfetched_data] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });
  const decode_data = (arr) => {
    arr.forEach((data) => {
      data.function = decodeURIComponent(atob(data.function));

      data.testcases = decodeURIComponent(atob(data.testcases));
      data.checker = decodeURIComponent(atob(data.checker));
    });

    return arr;
  };
  const validate = (data) => {
    const dumy = (lan) => {
      return {
        function: "",
        language: lan,
        testcases: "",
        checker: "",
        problemId: problem.id,
        userId: user.id,
        creatorId: problem.creatorId,
      };
    };
    let js = data.find((p) => p.language == "JAVASCRIPT");
    let py = data.find((p) => p.language == "PYTHON");

    let java = data.find((p) => p.language == "JAVA");
    let cpp = data.find((p) => p.language == "CPP");

    if (js == undefined) {
      data.push(dumy("JAVASCRIPT"));
    }
    if (py == undefined) {
      data.push(dumy("PYTHON"));
    }
    if (java == undefined) {
      data.push(dumy("JAVA"));
    }
    if (cpp == undefined) {
      data.push(dumy("CPP"));
    }

    setfetched_data(data);
  };

  const send_data = async (problem) => {
    if (!code.trim()) {
      alert("Please enter some code");
      return;
    }

    const data = {
      function: btoa(encodeURIComponent(code)),
      language: btoa(encodeURIComponent(language)),
      testcases: btoa(encodeURIComponent(testCase)),
      checker: btoa(encodeURIComponent(testCode)),
      problemId: problem.id,
      userId: user.id,
      creatorId: problem.creatorid,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/problem/add`,
        data,

        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetch_data = async (problem) => {
    setisfatched(false);
    const response = await axios.get(
      `${API_URL}/problem/one/${problem.id}`,

      {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      }
    );

    const decoded = decode_data(response.data);
    validate(decoded);

    setisfatched(true);
  };
  useEffect(() => {
    fetch_data(problem);
  }, []);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const find_launguage_code = (launguage) => {
    const out = fetched_data.find((code) => {
      return code.language == launguage.toUpperCase();
    });

    setCode(out.function);
    setTestCase(out.testcases);
    setTestCode(out.checker);
  };
  useEffect(() => {
    if (isfatched) find_launguage_code(language);
  }, [language]);
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
      } p-4 md:p-8`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div
          className={`rounded-lg shadow-xl backdrop-blur-lg border border-transparent 
          transition-all duration-300 hover:shadow-2xl
          ${
            isDarkMode
              ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
              : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
          }`}
        >
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Code Input</h2>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
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

              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-all duration-300 
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
                  transition-all duration-300
                  backdrop-blur-lg border border-transparent
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

              <button
                onClick={() => send_data(problem)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg transition-all duration-300
                  ${
                    isDarkMode
                      ? "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800"
                      : "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400"
                  } text-white`}
              >
                {isLoading ? "Sending..." : "Send Code"}
              </button>
            </div>
          </div>

          <div className="flex border-b border-white border-opacity-20">
            {["code", "testcase", "testcode"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 transition-all duration-300
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

          <div className="p-6">
            <div
              className={`rounded-lg overflow-hidden border border-transparent
              ${
                isDarkMode ? "bg-white bg-opacity-5" : "bg-white bg-opacity-10"
              }`}
            >
              {activeTab === "code" && (
                <CodeEditor
                  handle_change={(e) => setCode(e)}
                  value={code}
                  launguage={language}
                  theme={isDarkMode ? "vs-dark" : "light"}
                />
              )}
              {activeTab === "testcase" && (
                <CodeEditor
                  handle_change={(e) => setTestCase(e)}
                  value={testCase}
                  launguage={language}
                  theme={isDarkMode ? "vs-dark" : "light"}
                />
              )}
              {activeTab === "testcode" && (
                <CodeEditor
                  handle_change={(e) => setTestCode(e)}
                  value={testCode}
                  launguage={language}
                  theme={isDarkMode ? "vs-dark" : "light"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
