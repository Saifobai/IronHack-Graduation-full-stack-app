import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "../api/axios";
import { useSelector } from "react-redux";

const DownloadModal = ({ onClose, videoLink }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleDownload = async (type) => {
    if (!videoLink) {
      alert("❌ Please enter a video link first.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Downloading & processing...");

      // Select endpoint
      const endpoint = type === "tiktok" ? "/video/tiktok" : "/video/youtube";

      // Send POST request with video URL
      const res = await api.post(
        endpoint,
        { url: videoLink },
        { responseType: "blob" }
      );

      setStatus("Almost done...");

      // Create download link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        type === "tiktok" ? "tiktok_video.mp4" : "youtube_video.mp4"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Download failed. Try again.");
    } finally {
      setIsLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 border border-gray-700 rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            Choose Download Format
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-400 mb-8">
          Select how you want to save your video 🎬
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-6">
          <button
            onClick={() => handleDownload("tiktok")}
            disabled={isLoading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> {status || "Processing..."}
              </span>
            ) : (
              "📱 TikTok Format (9:16 with black borders)"
            )}
          </button>

          <button
            onClick={() => handleDownload("youtube")}
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> {status || "Processing..."}
              </span>
            ) : (
              "▶️ YouTube Format (original)"
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-8 text-gray-400 hover:text-white transition"
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DownloadModal;
