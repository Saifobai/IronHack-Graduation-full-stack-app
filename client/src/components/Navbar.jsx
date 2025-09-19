import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../redux/user/userSlice";
import { MessageSquare } from "lucide-react"; // chatbot icon

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, loading } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);

  const role = currentUser?.role;
  const credits = currentUser?.credits;
  console.log("here is the current user in navbar:", currentUser);

  const handleLogout = () => {
    dispatch(signOutUser());
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900/90 backdrop-blur-md text-white shadow-md sticky top-0 z-50">
      {/* Left Side */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent"
        >
          ClipoFrameAI
        </Link>

        {currentUser && (
          <Link to="/user-dashboard" className="hover:text-cyan-300 transition">
            Dashboard
          </Link>
        )}

        {role === "admin" && (
          <Link to="/admin" className="hover:text-yellow-300 font-semibold">
            Admin Panel
          </Link>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        {currentUser ? (
          <div className="flex items-center space-x-3">
            {/* Show credits */}
            <span className="bg-gray-800 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium shadow">
              💎 {credits} Credits
            </span>

            {/* Profile Image */}
            <img
              src={currentUser?.photo}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-cyan-400"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-gray-800 border border-gray-700 text-white rounded-xl shadow-lg w-56 z-50 py-2">
                <div className="px-4 py-2 border-b border-gray-700 text-sm text-cyan-400 font-semibold">
                  👋 {currentUser?.username}
                </div>
                <div className="px-4 py-2 text-sm text-yellow-300">
                  💎 Credits: {credits}
                </div>
                <button
                  onClick={() => {
                    navigate("/edit-profile");
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 hover:text-cyan-300 text-sm"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 hover:text-red-400 text-sm text-red-300"
                >
                  {loading ? "Signing out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/signin">
              <button className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg shadow-md text-white text-sm transition">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg shadow-md text-white text-sm transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
