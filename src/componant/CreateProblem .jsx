// import React, { useState } from "react";
// import { X } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import { useNavigate } from "react-router-dom";

// const CreateProblem = ({ onSubmit, onClose }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [difficulty, setDifficulty] = useState("");
//   const [currentTag, setCurrentTag] = useState("");
//   const [tags, setTags] = useState([]);
//   const [isPreview, setIsPreview] = useState(false);
//   const navigate = useNavigate();
//   const handleSubmit = async () => {
//     if (!title || !description || !difficulty) {
//       alert("Please fill all required fields");
//       return;
//     }

//     onSubmit({
//       title,
//       description,
//       difficulty: difficulty.toUpperCase(),
//       tags,
//     });
//   };

//   const handleAddTag = () => {
//     if (currentTag && !tags.includes(currentTag)) {
//       setTags([...tags, currentTag]);
//       setCurrentTag("");
//     }
//   };

//   const removeTag = (tagToRemove) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center z-10 justify-center p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold dark:text-white">
//             Add New Problem
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//           >
//             <X className="w-5 h-5 dark:text-white" />
//           </button>
//         </div>

//         <input
//           type="text"
//           placeholder="Problem Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />

//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium dark:text-white">
//               Description
//             </span>
//             <button
//               onClick={() => setIsPreview(!isPreview)}
//               className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
//             >
//               {isPreview ? "Edit" : "Preview"}
//             </button>
//           </div>

//           {isPreview ? (
//             <div className="prose dark:prose-invert max-w-none border rounded-lg p-4 min-h-[200px] dark:bg-gray-700">
//               <ReactMarkdown>{description}</ReactMarkdown>
//             </div>
//           ) : (
//             <textarea
//               placeholder="Problem Description (Markdown supported)"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
//             />
//           )}
//         </div>

//         <select
//           value={difficulty}
//           onChange={(e) => setDifficulty(e.target.value)}
//           className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         >
//           <option value="">Select Difficulty</option>
//           <option value="EASY">Easy</option>
//           <option value="MEDIUM">Medium</option>
//           <option value="HARD">Hard</option>
//         </select>

//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Add tags"
//             value={currentTag}
//             onChange={(e) => setCurrentTag(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
//             className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           />
//           <button
//             onClick={handleAddTag}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
//           >
//             Add Tag
//           </button>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {tags.map((tag, index) => (
//             <span
//               key={index}
//               className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-200"
//             >
//               {tag}
//               <X
//                 className="w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white"
//                 onClick={() => removeTag(tag)}
//               />
//             </span>
//           ))}
//         </div>

//         <button
//           onClick={handleSubmit}
//           className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Submit Problem
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateProblem;
import React, { useState } from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import Nav from "./Nav";

const CreateProblem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

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
      // Navigate back to dashboard after successful submission
      window.location.href = "/dashboard";
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
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Create New Problem
            </h1>
            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
            <input
              type="text"
              placeholder="Problem Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium dark:text-white">
                    Description
                  </span>
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {isPreview ? "Edit" : "Preview"}
                  </button>
                </div>

                <textarea
                  placeholder="Problem Description (Markdown supported)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[500px] dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                  style={{ display: isPreview ? "none" : "block" }}
                />
              </div>

              <div
                className={`border rounded-lg p-4 min-h-[500px] overflow-y-auto dark:border-gray-700 ${
                  !isPreview && "hidden md:block"
                }`}
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Difficulty</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-200"
                >
                  {tag}
                  <X
                    className="w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                    onClick={() => removeTag(tag)}
                  />
                </span>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
