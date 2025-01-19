import React from "react";
import { Link } from "react-router-dom";
function Nav({ isDarkMode }) {
  return (
    <>
      <nav>
        <div
          className={`transition-all duration-500 ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800"
              : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400"
          }`}
        >
          <ul className="flex justify-center items-center max-w-6xl mx-auto">
            {["Home", "YourCode", "Login", "Create", "Play"].map(
              (item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className={`block px-6 py-4 font-bold transition-all duration-300
                  ${
                    isDarkMode
                      ? "text-white hover:bg-white hover:bg-opacity-10"
                      : "text-gray-900 hover:bg-white hover:bg-opacity-20"
                  }
                  backdrop-blur-lg`}
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Nav;
