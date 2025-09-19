import { useState } from "react";

const UploadModal = ({ onClose, onUpload }) => {
  const [activeTab, setActiveTab] = useState("link");
  const [linkInput, setLinkInput] = useState("");
  const [file, setFile] = useState(null);

  const handleLinkUpload = () => {
    if (!linkInput.trim()) return;
    onUpload(linkInput); // Pass link back to dashboard
    onClose();
  };

  const handleFileUpload = () => {
    if (!file) return;
    // In real case you’d upload file to backend -> get back a playable URL
    const fileUrl = URL.createObjectURL(file);
    onUpload(fileUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-[500px] relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
        >
          ✖
        </button>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Upload Video</h3>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "link"
                ? "bg-cyan-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("link")}
          >
            Paste Link
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "file"
                ? "bg-pink-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("file")}
          >
            Upload File
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "link" && (
          <div>
            <input
              type="text"
              placeholder="Paste YouTube/TikTok link..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none"
            />
            <button
              onClick={handleLinkUpload}
              className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-pink-500 py-3 rounded-lg font-semibold"
            >
              Analyze Link
            </button>
          </div>
        )}

        {activeTab === "file" && (
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
            />
            <button
              onClick={handleFileUpload}
              className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-lg font-semibold"
            >
              Upload & Analyze
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
