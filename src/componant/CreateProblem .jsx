import axios from "axios";
import { useState, useContext } from "react";
import { Usercontext } from "./UsrProvider";
import { Moon, Sun, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import Nav from "./Nav";
const API_URL = import.meta.env.VITE_API_URL;
const CreateProblem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
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
      window.location.href = "/login";
    }
  };
  useState(() => {
    check_user(0);
  }, []);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", !isDarkMode);
  };
  const handleSubmit = async () => {
    if (!title || !description || !difficulty) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/problem`,
        {
          title,
          description,
          difficulty: difficulty.toUpperCase(),
          tags,
        },
        { withCredentials: true }
      );

      window.location.href = "/home";
    } catch (error) {
      console.error("Error submitting problem:", error);
    }
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const markdownExample = ``;

  //   const markdownExample = `# Example Markdown Formatting

  // ## Headers
  // # H1 Header
  // ## H2 Header
  // ### H3 Header

  // ## Lists
  // - Bullet point 1
  // - Bullet point 2
  //   - Nested bullet point

  // 1. Numbered item 1
  // 2. Numbered item 2

  // ## Code Blocks
  // \`\`\`python
  // def example():
  //     return "Hello World"
  // \`\`\`

  // ## Text Formatting
  // **Bold text**
  // *Italic text*
  // ~~Strikethrough~~

  // ## Links and Images
  // [Link text](https://example.com)
  // ![Image alt text](image-url)

  // ## Blockquotes
  // > This is a blockquote

  // ## Tables
  // | Header 1 | Header 2 |
  // |----------|----------|
  // | Cell 1   | Cell 2   |
  // `;

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
        <div className="flex bg-transparent gap-4  justify-end">
          <button
            onClick={toggleDarkMode}
            className={`p-3 theme-toggle hover:rotate-180 rounded-full  shadow-lg transition-all duration-300 ${
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
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">
              Create New Problem
            </h1>
            <Link
              to="/home"
              className={`px-4 py-2 rounded-lg transition-all duration-300
              backdrop-blur-lg border border-transparent
              ${
                isDarkMode
                  ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                  : "bg-white bg-opacity-20 hover:bg-opacity-30"
              }`}
            >
              Back to Dashboard
            </Link>
          </div>

          <div
            className={`rounded-lg shadow-xl backdrop-blur-lg border border-transparent 
          transition-all duration-300 hover:shadow-2xl p-6 space-y-6
          ${
            isDarkMode
              ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
              : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
          }`}
          >
            <input
              type="text"
              placeholder="Problem Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg outline-none
              transition-all duration-300 backdrop-blur-lg border border-transparent
              ${
                isDarkMode
                  ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                  : "bg-white bg-opacity-20 hover:bg-opacity-30"
              }`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Description</span>
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`text-sm transition-all duration-300
                    ${
                      isDarkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                  >
                    {isPreview ? "Edit" : "Preview"}
                  </button>
                </div>

                <textarea
                  placeholder="Problem Description (Markdown supported)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg outline-none min-h-[500px]
                  transition-all duration-300 backdrop-blur-lg border border-transparent font-mono
                  ${
                    isDarkMode
                      ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                      : "bg-white bg-opacity-20 hover:bg-opacity-30"
                  }
                  ${isPreview ? "hidden" : "block"}`}
                />
              </div>

              <div
                className={`rounded-lg p-4 min-h-[500px] overflow-y-auto
              backdrop-blur-lg border border-transparent
              ${
                isDarkMode ? "bg-white bg-opacity-10" : "bg-white bg-opacity-20"
              }
              ${!isPreview && "hidden md:block"}`}
              >
                <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {description || markdownExample}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg outline-none
              transition-all duration-300 backdrop-blur-lg border border-transparent
              ${
                isDarkMode
                  ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                  : "bg-white bg-opacity-20 hover:bg-opacity-30"
              }`}
            >
              <option
                className={`text-black ${
                  isDarkMode
                    ? "bg-purple-500 bg-opacity-10 hover:bg-opacity-20"
                    : "bg-teal-100 bg-opacity-20 hover:bg-opacity-30"
                } `}
                value=""
              >
                Select Difficulty
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

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Add tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className={`flex-1 px-4 py-2 rounded-lg outline-none
                transition-all duration-300 backdrop-blur-lg border border-transparent
                ${
                  isDarkMode
                    ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                    : "bg-white bg-opacity-20 hover:bg-opacity-30"
                }`}
              />
              <button
                onClick={handleAddTag}
                className={`px-4 py-2 rounded-lg transition-all duration-300
                backdrop-blur-lg border border-transparent
                ${
                  isDarkMode
                    ? "bg-white bg-opacity-10 hover:bg-opacity-20"
                    : "bg-white bg-opacity-20 hover:bg-opacity-30"
                }`}
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full
                  backdrop-blur-lg border border-transparent
                  ${
                    isDarkMode
                      ? "bg-white bg-opacity-10"
                      : "bg-white bg-opacity-20"
                  }`}
                >
                  {tag}
                  <X
                    className="w-4 h-4 cursor-pointer hover:text-gray-300 transition-colors"
                    onClick={() => removeTag(tag)}
                  />
                </span>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className={`w-full px-4 py-2 rounded-lg transition-all duration-300
              ${
                isDarkMode
                  ? "bg-violet-600 hover:bg-violet-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Submit Problem
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProblem;
