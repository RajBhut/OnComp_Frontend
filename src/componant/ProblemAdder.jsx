import React, { useState, useRef, useEffect, useContext } from "react";
import { Usercontext } from "./UsrProvider";
import axios from "axios";
import "../App.css";
import { Link, useLocation } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import Split from "react-split";
import { Moon, Sun } from "lucide-react";

export default function ProblemAdder() {
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

    if (!js) {
      data.push(dumy("JAVASCRIPT"));
    } else if (!py) {
      data.push(dumy("PYTHON"));
    } else if (!java) {
      data.push(dumy("JAVA"));
    } else if (!cpp) {
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
      creatorId: problem.creatorId,
    };
    try {
      setIsLoading(true);

      const response = await axios.post(
        `http://localhost:8000/problem/add`,
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
      `http://localhost:8000/problem/one/${problem.id}`,

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
    python: `class Solution():\n    # Your code here\n    pass`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-9yyy00 transition-colors duration-200">
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Code Input
            </h2>
            <button
              onClick={() => send_data(problem)}
              disabled={isLoading}
              className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800"
            >
              {isLoading ? "sending..." : "send Code"}
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <Link
                className="text-white bg-blue-600 flex justify-center items-center hover:bg-blue-700 px-4 py-2 rounded-lg"
                to={"/"}
              >
                Home
              </Link>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setCode(CODE_TEMPLATES[language])}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-2 py-1 rounded text-gray-700 dark:text-gray-200"
              >
                Template
              </button>
            </div>
          </div>

          <div className="flex border-b dark:border-gray-700">
            {["code", "testcase", "testcode"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 flex-1 ${
                  activeTab === tab
                    ? "bg-blue-100 dark:bg-blue-900 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-4 flex-grow overflow-auto dark:bg-gray-800">
            {activeTab === "code" && (
              <div className="w-full h-full p-2 border rounded font-mono resize-none dark:border-gray-700">
                <CodeEditor
                  handle_change={(e) => setCode(e)}
                  value={code}
                  launguage={language}
                  theme={isDarkMode ? "vs-dark" : "light"}
                />
              </div>
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
                value={testCode}
                handle_change={(e) => setTestCode(e)}
                launguage={language}
                theme={isDarkMode ? "vs-dark" : "light"}
              />
            )}
          </div>

          <div className="p-4 dark:bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
}
