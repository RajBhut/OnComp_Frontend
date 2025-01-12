import React, { useState, useRef, useEffect, useContext } from "react";
import { Usercontext } from "./UsrProvider";
import axios from "axios";
import "../App.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import Split from "react-split";
import { Moon, Sun } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Graph from "./Graph";
import GraphProvider, { Graphcontext } from "./GraphProvider";
export default function Problem_Page() {
  const { Graphdata, setGraphdata, Edgedata, setEdgedata } =
    useContext(Graphcontext);
  const [isfatched, setisfatched] = useState(false);
  const [description, setDescription] = useState(null);
  const { setuser, user } = useContext(Usercontext);
  const [code, setCode] = useState(``);
  const [testCase, setTestCase] = useState("");
  const [testCode, setTestCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const location = useLocation();
  const { id } = useParams();
  const [fetched_data, setfetched_data] = useState([]);
  const navigator = useNavigate();
  const markdownExample = `
# Test
### Example

#### Example 1:

  `;

  const recive_notes_data = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/problem/update/${id}`);

      setGraphdata(JSON.parse(res.data.nodedata));

      setEdgedata(JSON.parse(res.data.edgedata));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    recive_notes_data();
  }, []);

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
        problemId: id,
        userId: 1,
        creatorId: 1,
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
  const fetch_problem_data = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/problem/data/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data[0].description) {
        setDescription(res.data[0].description);
      }
    } catch (error) {
      console.log(error);
      navigator("/");
    }
  };

  const fetch_data = async (id) => {
    setisfatched(false);
    const response = await axios.get(
      `http://localhost:8000/problem/one/${id}`,

      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const decoded = decode_data(response.data);
    validate(decoded);

    setisfatched(true);
  };
  useEffect(() => {
    fetch_problem_data(id);
    fetch_data(id);
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
  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please enter some code");
      return;
    }
    console.log(code);
    setIsLoading(true);
    try {
      const payload = {
        code: btoa(encodeURIComponent(code)),
        language: language.toLowerCase(),
        testcase: btoa(encodeURIComponent(testCase)),
        testcode: btoa(encodeURIComponent(testCode)),
      };

      const response = await axios.post("http://localhost:3000/prob", payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });
      console.log(response.data);
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
    python: `class Solution():\n    # Your code here\n    pass`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto p-4">
        <Split className="flex" sizes={[40, 60]}>
          <div className="prose p-2 font-mono text-xs prose-sm md:prose-base lg:prose-lg dark:prose-invert bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Code Input
              </h2>
              <button
                onClick={() => {
                  handleSubmit();
                }}
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
              {["code", "testcase", "note"].map((tab) => (
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
              {activeTab === "note" && (
                <GraphProvider>
                  <Graph InEdge={Edgedata} InNode={Graphdata} />
                </GraphProvider>
              )}
            </div>

            <div className="p-4 dark:bg-gray-800"></div>
          </div>
        </Split>
      </div>
    </div>
  );
}
