import React from "react";
import { Link } from "react-router-dom";
function Nav() {
  return (
    <>
      <nav className="">
        <ul className="flex justify-center space-x-4 gap-10 bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-bold text-white ">
          {["Home", "About", "login", "Create"].map((item, index) => {
            return (
              <li
                className="hover:text-black transition-all duration-500 px-4 py-2 "
                key={index}
              >
                <Link to={`/${item.toLowerCase()}`} key={index}>
                  {item}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default Nav;
