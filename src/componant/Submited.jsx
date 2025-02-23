import React, { useState, useRef, useEffect, useContext } from "react";
import { Usercontext } from "./UsrProvider";
import axios from "axios";
import "../App.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import Split from "react-split";
import { Home, Moon, Sun } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Graph from "./Graph";
import GraphProvider, { Graphcontext } from "./GraphProvider";
import { useMediaQuery } from "react-responsive";
export default function Submited() {
 

  const API_URL = import.meta.env.VITE_API_URL;
  const CODE_API_URL = import.meta.env.VITE_CODE_API_URL;
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
  const [active, setActiveTab] = useState("code");
  const location = useLocation();
  const { id } = useParams();
  const [fetched_data, setfetched_data] = useState([]);
  const navigator = useNavigate();
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const markdownExample = `
# Test
### Example

#### Example 1:

`;

  const recive_notes_data = async () => {
    try {
      const res = await axios.get(`${API_URL}/problem/update/${id}`);
      if (res.data.nodedata) setGraphdata(JSON.parse(res.data.nodedata));
      if (res.data.edgedata) setEdgedata(JSON.parse(res.data.edgedata));
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

    return data;
  };

  const fetch_problem_data = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/problem/update/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const problem = res.data;

      if (problem && problem.description) {
        setDescription(problem.description);
      } else {
        setDescription(null);
      }
    } catch (error) {
      console.error("Error fetching problem data:", error);
      navigator("/login");
    }
  };

  const fetch_data = async (id) => {
    setisfatched(false);
    try {
      const response = await axios.get(`${API_URL}/problem/one/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const decoded = decode_data(response.data);
      const validatedData = validate(decoded);
      setfetched_data(validatedData);

      const initialLanguageCode = validatedData.find(
        (code) => code.language === language.toUpperCase()
      );
      if (initialLanguageCode) {
        setCode(initialLanguageCode.function);
        setTestCase(initialLanguageCode.testcases);
        setTestCode(initialLanguageCode.checker);
      }

      setisfatched(true);
    } catch (error) {
      console.error(error);
      setisfatched(false);
    }
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

  useEffect(() => {
    if (isfatched && fetched_data.length > 0) {
      const languageCode = fetched_data.find(
        (code) => code.language === language.toUpperCase()
      );
      if (languageCode) {
        setCode(languageCode.function);
        setTestCase(languageCode.testcases);
        setTestCode(languageCode.checker);
      }
    }
  }, [language, isfatched, fetched_data]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", !isDarkMode);
  };

  const LANGUAGES = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    // { value: "cpp", label: "C++" },
  ];

  const check_status = (code) => {
    let lines = code.split("\n").map((line) => line.trim());

    let failedLine = lines.find((line) => line.includes("Test Cases Failed:"));

    if (failedLine) {
      let failedCount = parseInt(failedLine.split(":")[1].trim(), 10);

      return failedCount === 0;
    }

    console.error("Failed to find test cases result in the output.");
    return false;
  };
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
        testcase: btoa(encodeURIComponent(testCase)),
        testcode: btoa(encodeURIComponent(testCode)),
      };
      const response = await axios.post(`${CODE_API_URL}/prob`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });
      if (check_status(response.data)) {
        try {
          let res = await axios.post(
            `${API_URL}/problem/solved/${id}`,
            {
              language: language.toUpperCase(),
              function: btoa(encodeURIComponent(code)),
            },
            { withCredentials: true }
          );
          console.log(res);
        } catch (error) {
          console.error(error);
        }
      }
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
    java: ` class Run {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  };

  return (
    <div
      className={`min-h-screen font-mono transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white"
          : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 text-gray-900"
      }`}
    >
      <div className="container mx-auto min-w-full">
        {isBigScreen ? (
          <Split className="flex" sizes={[40, 60]}>
            <div className="flex-col w-full pr-2">
              <div
                className={`h-full flex flex-col rounded-lg shadow-xl backdrop-blur-lg border border-transparent
              ${
                isDarkMode
                  ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                  : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
              }`}
              >
                <div className="flex  border-b border-white border-opacity-20">
                  {["description", "output"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveLeftTab(tab)}
                      className={`flex-1 px-6 py-3 transition-all duration-300
                      ${
                        activeLeftTab === tab
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

                <div
                  className={`flex-grow p-4  overflow-auto    ${
                    isDarkMode ? "bg-gray-600 " : " bg-white "
                  }`}
                >
                  {activeLeftTab === "description" && (
                    <div className="prose w-full max-h-[100vh] overflow-y-scroll dark:prose-invert">
                      {isLoading ? (
                        <div className="flex justify-center items-center h-96">
                          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                      ) : (
                        <ReactMarkdown>{description}</ReactMarkdown>
                      )}
                    </div>
                  )}
                  {activeLeftTab === "output" && (
                    <textarea
                      value={output}
                      readOnly
                      placeholder="Output will appear here..."
                      className={`w-full h-full p-2 rounded-lg outline-none resize-none
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-5"
                          : "bg-white bg-opacity-10"
                      }`}
                    />
                  )}
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
              <div className="p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Code Input</h2>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg transition-all duration-300
                    ${
                      isDarkMode
                        ? "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800"
                        : "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400"
                    } text-white`}
                  >
                    {isLoading ? "Running..." : "Run"}
                  </button>

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
                    to="/home"
                    className={`p-3 rounded-lg transition-all duration-300
                    backdrop-blur-lg border border-transparent
                    ${
                      isDarkMode
                        ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                        : "bg-white bg-opacity-20 hover:bg-opacity-30"
                    }`}
                  >
                    <Home className="w-5 h-5" />
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
                        key={lang.value}
                        value={lang.value}
                        className="text-black"
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
                {["code", "testcase", "note"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-3 transition-all duration-300
                    ${
                      active === tab
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

              {/* Right Panel Content */}
              <div className="p-6 flex-grow overflow-auto">
                {active === "code" && (
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
                      handlesubmit={handleSubmit}
                    />
                  </div>
                )}
                {active === "testcase" && (
                  <CodeEditor
                    handle_change={(e) => setTestCase(e)}
                    value={testCase}
                    launguage={language}
                    theme={isDarkMode ? "vs-dark" : "light"}
                    handlesubmit={handleSubmit}
                  />
                )}
                {active === "note" && (
                  <GraphProvider>
                    <Graph InEdge={[]} InNode={[]} />
                  </GraphProvider>
                )}
              </div>
            </div>
          </Split>
        ) : (
          <div className="flex flex-col">
            <div className="flex-col w-full pr-2">
              <div
                className={`h-full flex flex-col rounded-lg shadow-xl backdrop-blur-lg border border-transparent
              ${
                isDarkMode
                  ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                  : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
              }`}
              >
                <div className="flex  border-b border-white border-opacity-20">
                  {["description", "output"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveLeftTab(tab)}
                      className={`flex-1 px-6 py-3 transition-all duration-300
                      ${
                        activeLeftTab === tab
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

                <div
                  className={`flex-grow p-4  overflow-auto    ${
                    isDarkMode ? "bg-gray-600 " : " bg-white "
                  }`}
                >
                  {activeLeftTab === "description" && (
                    <div className="prose w-full max-h-[100vh] overflow-y-scroll dark:prose-invert">
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </div>
                  )}
                  {activeLeftTab === "output" && (
                    <textarea
                      value={output}
                      readOnly
                      placeholder="Output will appear here..."
                      className={`w-full h-full min-h-[100vh] p-2 rounded-lg outline-none resize-none
                      ${
                        isDarkMode
                          ? "bg-white bg-opacity-5"
                          : "bg-white bg-opacity-10"
                      }`}
                    />
                  )}
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
              <div className="p-4 flex flex-wrap justify-between items-center">
                <h2 className="text-xl font-bold">Code Input</h2>

                <div className="flex  flex-wrap items-center gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg transition-all duration-300
                    ${
                      isDarkMode
                        ? "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800"
                        : "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400"
                    } text-white`}
                  >
                    {isLoading ? "Running..." : "Run"}
                  </button>

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
                    to="/home"
                    className={`p-3 rounded-lg transition-all duration-300
                    backdrop-blur-lg border border-transparent
                    ${
                      isDarkMode
                        ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                        : "bg-white bg-opacity-20 hover:bg-opacity-30"
                    }`}
                  >
                    <Home className="w-5 h-5" />
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
                        key={lang.value}
                        value={lang.value}
                        className="text-black"
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
                {["code", "testcase", "note"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-3 transition-all duration-300
                    ${
                      active === tab
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

              <div className="p-6 flex-grow overflow-auto">
                {active === "code" && (
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
                      handlesubmit={handleSubmit}
                    />
                  </div>
                )}
                {active === "testcase" && (
                  <CodeEditor
                    handle_change={(e) => setTestCase(e)}
                    value={testCase}
                    launguage={language}
                    theme={isDarkMode ? "vs-dark" : "light"}
                    map={false}
                    handlesubmit={handleSubmit}
                  />
                )}
                {active === "note" && (
                  <GraphProvider>
                    <Graph InEdge={[]} InNode={[]} />
                  </GraphProvider>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
