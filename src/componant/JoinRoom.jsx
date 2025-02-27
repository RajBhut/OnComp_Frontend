import React, { useState, useEffect, useContext } from "react";
import { Sun, Moon, Search, Trash2, Plus, Home, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Usercontext } from "./UsrProvider";

export default function JoinRoom() {
  const { user } = useContext(Usercontext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      return isDark;
    }
    return false;
  });

  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomTitle, setRoomTitle] = useState("");
  const [createError, setCreateError] = useState(null);
  const [existingRoomNames, setExistingRoomNames] = useState(new Set());

  // Toggle dark mode functionality
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/problem/room`, {
          withCredentials: true,
        });

        // Make sure response.data is an array
        if (Array.isArray(response.data)) {
          setRooms(response.data);

          // Store existing room names in a Set for uniqueness check
          const nameSet = new Set();
          response.data.forEach((room) => {
            if (room.name) nameSet.add(room.name);
          });
          setExistingRoomNames(nameSet);
        } else {
          console.warn("API did not return an array for rooms", response.data);
          setRooms([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
        setLoading(false);
      }
    };

    if (user) {
      fetchRooms();
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [user, API_URL, navigate]);

  // Generate a random unique room name
  const generateRandomRoomName = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const length = 8;
    let result;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loops

    do {
      result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      attempts++;

      // Break if we've tried too many times to avoid potential infinite loop
      if (attempts > maxAttempts) {
        console.warn("Couldn't generate unique room name after many attempts");
        break;
      }
    } while (existingRoomNames.has(result));

    return result;
  };

  // Handle random name generation
  const handleGenerateRandomName = () => {
    const randomName = generateRandomRoomName();
    setRoomName(randomName);
  };

  // Create a new room
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName) {
      setCreateError("Room name is required");
      return;
    }

    if (!roomTitle) {
      setCreateError("Room title is required");
      return;
    }

    try {
      setCreateError(null);
      const response = await axios.post(
        `${API_URL}/problem/room`,
        {
          name: roomName,
          title: roomTitle,
        },
        {
          withCredentials: true,
        }
      );

      // Add the new room to the rooms list
      if (response.data.room) {
        setRooms((prevRooms) =>
          Array.isArray(prevRooms)
            ? [...prevRooms, response.data.room]
            : [response.data.room]
        );
        setExistingRoomNames((prev) => new Set(prev).add(roomName));
        setRoomName("");
        setRoomTitle("");
      }
    } catch (err) {
      setCreateError(err.response?.data?.detail || "Failed to create room");
      console.error("Error creating room:", err);
    }
  };

  // Delete a room
  const handleDeleteRoom = async (roomId) => {
    try {
      await axios.delete(`${API_URL}/problem/room/${roomId}`, {
        withCredentials: true,
      });

      // Remove the deleted room from the rooms list
      setRooms((prevRooms) => {
        if (Array.isArray(prevRooms)) {
          return prevRooms.filter((room) => room.name !== roomId);
        }
        return [];
      });

      // Also remove from the existing names set
      setExistingRoomNames((prev) => {
        const updated = new Set(prev);
        updated.delete(roomId);
        return updated;
      });
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("Failed to delete room. Please try again later.");
    }
  };

  // Filter rooms based on search term
  const filteredRooms = Array.isArray(rooms)
    ? rooms.filter(
        (room) =>
          (room.name &&
            room.name
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (room.title &&
            room.title
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    : [];

  // Check if the current user is the creator of a room
  const isRoomCreator = (room) => {
    return user && room.user_id === user.id;
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white"
          : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 text-gray-900"
      } p-4 md:p-8`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">OnComp Rooms</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-3 theme-toggle hover:rotate-180 rounded-full shadow-lg transition-all duration-300 ${
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
            <Link to="/home">
              <Home className="text-2xl font-bold text-dark-600 dark:text-white" />
            </Link>
          </div>
        </header>

        {/* Create Room Form */}
        <div
          className={`rounded-lg shadow-xl backdrop-blur-lg border border-transparent 
          transition-all duration-300 p-6
          ${isDarkMode ? "bg-white bg-opacity-10" : "bg-white bg-opacity-20"}`}
        >
          <h2 className="text-xl font-semibold mb-4">Create New Room</h2>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div className="relative">
              <label
                className={`block mb-1 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Room Name
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg outline-none 
                      bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                      focus:border-white focus:border-opacity-30
                      ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateRandomName}
                  className={`p-2 rounded-lg ${
                    isDarkMode
                      ? "bg-purple-600 hover:bg-purple-500"
                      : "bg-teal-600 hover:bg-teal-500"
                  } text-white flex items-center gap-1`}
                  title="Generate Random Name"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <label
                className={`block mb-1 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Room Title
              </label>
              <input
                type="text"
                placeholder="Enter Room Title"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg outline-none 
                  bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                  focus:border-white focus:border-opacity-30
                  ${isDarkMode ? "text-white" : "text-gray-900"}`}
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4" />
              Create Room
            </button>
          </form>
          {createError && <p className="mt-2 text-red-400">{createError}</p>}
        </div>

        {/* Room List */}
        <div
          className={`rounded-lg shadow-xl backdrop-blur-lg border border-transparent 
          transition-all duration-300 hover:shadow-2xl p-6
          ${
            isDarkMode
              ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
              : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              />
              <input
                type="text"
                placeholder="Search Rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none 
                  bg-white bg-opacity-20 backdrop-blur-lg border border-transparent
                  focus:border-white focus:border-opacity-30
                  ${isDarkMode ? "text-white" : "text-gray-900"}`}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Loading rooms...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">{error}</div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-8">
              No rooms found. Create one to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id || room.name}
                  className={`rounded-xl p-4 transition-all duration-300
                    backdrop-blur-lg border border-transparent
                    hover:shadow-xl hover:scale-[1.02]
                    ${
                      isDarkMode
                        ? "bg-white bg-opacity-10 hover:border-white hover:border-opacity-20"
                        : "bg-white bg-opacity-20 hover:border-white hover:border-opacity-20"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{room.title}</h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Room ID: {room.name}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Created by:{" "}
                        {room.user_id === user?.id
                          ? "You"
                          : `User ${room.user_id}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/room/${room.name}`}
                        className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Join
                      </Link>

                      {isRoomCreator(room) && (
                        <button
                          onClick={() => handleDeleteRoom(room.name)}
                          className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
                          title="Delete Room"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
