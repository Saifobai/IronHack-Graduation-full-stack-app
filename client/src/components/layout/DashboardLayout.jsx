import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Upload, History, Scissors, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children, theme = "dark" }) => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition ${
      isActive(path) ? "bg-gray-800 text-cyan-400" : ""
    }`;

  // Theme styles
  const mainBg =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          ClipoFrameAI
        </div>
        <nav className="flex-1 p-4 space-y-2 border-r border-gray-800">
          <Link
            to="/user-dashboard/upload"
            className={navLinkClass("/dashboard/upload")}
          >
            <Upload size={18} /> Upload Video
          </Link>
          <Link
            to="/user-dashboard/summaries"
            className={navLinkClass("/dashboard/summaries")}
          >
            <Scissors size={18} /> Summaries
          </Link>
          <Link
            to="/user-dashboard/history"
            className={navLinkClass("/dashboard/history")}
          >
            <History size={18} /> History
          </Link>
          <Link
            to="/user-dashboard/chat"
            className={navLinkClass("/dashboard/chat")}
          >
            <MessageSquare size={18} /> AI Chat
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-semibold">{currentUser?.username}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-8 overflow-y-auto ${mainBg}`}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
