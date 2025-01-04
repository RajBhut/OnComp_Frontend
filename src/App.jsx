// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import "./App.css";
// import { Link } from "react-router-dom";
// import CodeEditor from "./componant/CodeEditor";
// import Split from "react-split";
// export default function App() {
//   const [code, setCode] = useState(``);
//   const [testCase, setTestCase] = useState("");
//   const [testCode, setTestCode] = useState("");
//   const [output, setOutput] = useState("");
//   const [language, setLanguage] = useState("python");
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("code");

//   const LANGUAGES = [
//     { value: "javascript", label: "JavaScript" },
//     { value: "python", label: "Python" },
//     { value: "java", label: "Java" },
//     { value: "cpp", label: "C++" },
//   ];

//   const handleSubmit = async () => {
//     if (!code.trim()) {
//       alert("Please enter some code");
//       return;
//     }
//     console.log(code);
//     console.log(testCase);
//     console.log(testCode);
//     setIsLoading(true);
//     try {
//       // const payload = {
//       //   code: btoa(code),
//       //   language,
//       //   testCase: testCase || undefined,
//       //   testCode: testCode || undefined,
//       // };
//       const payload = {
//         // code: btoa(code),
//         // testcase: btoa(testCase),
//         // testcode: btoa(testCode),
//         code: btoa(encodeURIComponent(code)),
//         testcase: btoa(encodeURIComponent(testCase)),
//         testcode: btoa(encodeURIComponent(testCode)),
//       };

//       const response = await axios.post("http://localhost:3000/prob", payload, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: false,
//       });

//       setOutput(response.data);
//     } catch (error) {
//       console.error(error);
//       setOutput("Error executing code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.ctrlKey && event.key === "Enter") {
//         handleSubmit();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [code, testCase, testCode]);

//   const CODE_TEMPLATES = {
//     javascript: `function solution() {\n  // Your code here\n}`,
//     python: `class Solution():\n    # Your code here\n    pass`,
//     java: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
//     cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <Split className="flex" sizes={[50, 50]}>
//         <div className=" bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
//           <div className="bg-gray-100 p-4 flex justify-between items-center">
//             <h2 className="text-xl font-bold text-gray-800">Code Input</h2>
//             <Link
//               className="text-white bg-blue-600 flex  justify-center items-center hover:bg-blue-700 px-4 py-2 rounded-lg"
//               to={"/"}
//             >
//               Home
//             </Link>
//             <div className="flex items-center space-x-2">
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="px-2 py-1 border rounded"
//               >
//                 {LANGUAGES.map((lang) => (
//                   <option key={lang.value} value={lang.value}>
//                     {lang.label}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={() => setCode()}
//                 className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
//               >
//                 Template
//               </button>
//             </div>
//           </div>

//           <div className="flex border-b">
//             {["code", "testcase", "testcode"].map((tab) => (
//               <button
//                 key={tab}
//                 className={`px-4 py-2 flex-1 ${
//                   activeTab === tab
//                     ? "bg-blue-100 border-b-2 border-blue-500 text-blue-600"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           <div className="p-4 flex-grow overflow-auto">
//             {activeTab === "code" && (
//               <div className="w-full h-full p-2 border rounded font-mono resize-none">
//                 <CodeEditor
//                   handle_change={(e) => setCode(e)}
//                   value={code}
//                   launguage={language}
//                 />
//               </div>
//             )}
//             {activeTab === "testcase" && (
//               <CodeEditor
//                 handle_change={(e) => setTestCase(e)}
//                 value={testCase}
//                 launguage={language}
//               />
//             )}
//             {activeTab === "testcode" && (
//               <CodeEditor
//                 value={testCode}
//                 handle_change={(e) => setTestCode(e)}
//                 launguage={language}
//               />
//             )}
//           </div>

//           <div className="p-4">
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
//             >
//               {isLoading ? "Running..." : "Run Code"}
//             </button>
//           </div>
//         </div>

//         <div className=" bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
//           <div className="bg-gray-100 p-4">
//             <h2 className="text-xl font-bold text-gray-800">Output</h2>
//           </div>
//           <div className="p-4 flex-grow overflow-auto">
//             <textarea
//               value={output}
//               readOnly
//               placeholder="Output will appear here..."
//               className="w-full h-full p-2 border rounded bg-gray-50 resize-none"
//             />
//           </div>
//         </div>
//         {/* </div> */}
//       </Split>
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";
import CodeEditor from "./componant/CodeEditor";
import Split from "react-split";
import { Moon, Sun } from "lucide-react";

export default function App() {
  const [code, setCode] = useState(``);
  const [testCase, setTestCase] = useState("");
  const [testCode, setTestCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
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
        testcase: btoa(encodeURIComponent(testCase)),
        testcode: btoa(encodeURIComponent(testCode)),
      };

      const response = await axios.post("http://localhost:3000/prob", payload, {
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
    python: `class Solution():\n    # Your code here\n    pass`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto p-4">
        <Split className="flex" sizes={[50, 50]}>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Code Input
              </h2>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800"
              >
                {isLoading ? "Running..." : "Run Code"}
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

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gray-100 dark:bg-gray-700 p-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Output
              </h2>
            </div>
            <div className="p-4 flex-grow overflow-auto">
              <textarea
                value={output}
                readOnly
                placeholder="Output will appear here..."
                className="w-full h-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />
            </div>
          </div>
        </Split>
      </div>
    </div>
  );
}
