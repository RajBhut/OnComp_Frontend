import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "./UsrProvider";
import axios from "axios";
import {
  SunIcon,
  MoonIcon,
  UserIcon,
  LockIcon,
  MailIcon,
  ArrowRightIcon,
  Home,
} from "lucide-react";

export default function LoginPage() {
  const { setuser } = useContext(Usercontext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("signup");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const loginOrSignup = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === "signup" ? "/users/register" : "/users/login";
      const res = await axios.post(
        `${API_URL}${endpoint}`,
        { email, password, name },
        { withCredentials: true }
      );

      if (res.data.user) {
        setuser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white"
          : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-dark-600 dark:text-white">
            oncomp
          </h1>
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-3 theme-toggle hover:rotate-180 rounded-full shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {isDarkMode ? (
                <SunIcon size={24} className="w-5 h-5" />
              ) : (
                <MoonIcon size={24} className="w-5 h-5" />
              )}
            </button>
            <Link to={"/"}>
              <Home className="text-3xl font-bold text-dark-600 dark:text-white" />
            </Link>
          </div>
        </header>

        <div
          className={`rounded-lg shadow-xl backdrop-blur-lg border border-transparent 
          transition-all duration-300 hover:shadow-2xl p-6 max-w-md mx-auto
          ${
            isDarkMode
              ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
              : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
          }`}
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </h2>

            <div className="space-y-6">
              {mode === "signup" && (
                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none 
                      bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                      focus:border-white focus:border-opacity-30
                      ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  />
                </div>
              )}

              <div className="relative">
                <MailIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none 
                    bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                    focus:border-white focus:border-opacity-30
                    ${isDarkMode ? "text-white" : "text-gray-900"}`}
                />
              </div>

              <div className="relative">
                <LockIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none 
                    bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                    focus:border-white focus:border-opacity-30
                    ${isDarkMode ? "text-white" : "text-gray-900"}`}
                />
              </div>

              {mode === "signup" && (
                <div className="relative">
                  <LockIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none 
                      bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                      focus:border-white focus:border-opacity-30
                      ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={loginOrSignup}
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === "signup" ? "Sign Up" : "Log In"}</span>
                    <ArrowRightIcon size={20} />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() =>
                    setMode(mode === "signup" ? "login" : "signup")
                  }
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {mode === "signup"
                    ? "Already have an account?"
                    : "Need an account?"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
