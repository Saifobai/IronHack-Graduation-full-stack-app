import React from "react";
import { X } from "lucide-react";

const ChatbotWidget = ({ onClose }) => {
  return (
    <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-gray-900 text-white rounded-2xl shadow-2xl flex flex-col border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700 bg-gray-800 rounded-t-2xl">
        <h3 className="font-semibold text-cyan-400">AI Assistant</h3>
        <button onClick={onClose} className="hover:text-red-400">
          <X size={20} />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {/* Placeholder messages */}
        <div className="bg-gray-800 p-2 rounded-lg self-start max-w-[80%]">
          👋 Hi! Ask me anything about your video.
        </div>
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-cyan-500"
        />
        <button className="bg-gradient-to-r from-cyan-500 to-pink-500 px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotWidget;
