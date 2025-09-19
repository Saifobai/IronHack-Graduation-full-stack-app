import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useState } from "react";

const Profile = () => {
  const fileRef = useRef();

  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser?.user?.username || "",
    email: currentUser?.user?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    // Add this:
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleDeleteUser = (e) => {};

  const signOutUser = () => {};

  const handleUpdate = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-4">
          User Profile
        </h1>

        {currentUser?.user?.username && (
          <p className="text-center text-gray-300 text-lg mb-6">
            Welcome,{" "}
            <span className="font-semibold text-cyan-400">
              {currentUser.user.username}
            </span>{" "}
            👋
          </p>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          {/* Profile Picture */}
          <div className="relative self-center">
            <input type="file" ref={fileRef} hidden accept="image/*" />
            <img
              onClick={() => fileRef.current.click()}
              src={currentUser?.user.photo}
              alt="Profile"
              className="rounded-full h-28 w-28 object-cover border-4 border-cyan-400 shadow-md bg-gray-700 cursor-pointer"
            />
            <div
              onClick={() => fileRef.current.click()}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition cursor-pointer"
            >
              <FiEdit2 className="text-gray-700 text-lg" />
            </div>
          </div>

          {/* Inputs */}
          <input
            type="text"
            id="name"
            value={formData.username}
            onChange={handleChange}
            placeholder={currentUser?.user?.username || "Username"}
            className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (Optional)"
            className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
          />

          {/* Update Button */}
          <button
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-500"
          >
            {loading ? "Updating..." : "UPDATE"}
          </button>
        </form>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <span
            onClick={handleDeleteUser}
            className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-red-600 transition"
          >
            <FiTrash2 />
            Delete Account
          </span>
          <span
            onClick={signOutUser}
            className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-red-600 transition"
          >
            <FiLogOut />
            Sign out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
