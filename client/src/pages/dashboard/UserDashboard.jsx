import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  Video,
  FileText,
  Star,
  Download,
  Upload,
  Mic,
  FolderOpen,
} from "lucide-react";

import UploadModal from "../../components/UploadModal";
import DownloadModal from "../../components/DownloadModal";
import {
  summarizeVideo,
  generateHighlights,
  transcribeVideo,
  generateViralClips,
} from "../../services/jarvisApi";

import {
  VideoSummary,
  VideoHighlights,
  VideoTranscription,
  ViralClips,
} from "../../components/VideoResults";

import JarvisChat from "../../components/JarvisChat";
import { toast } from "react-toastify";
import LoadingModal from "../../components/LandingModal";

const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [highlightCard, setHighlightCard] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [summary, setSummary] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [transcription, setTranscription] = useState("");
  const [clips, setClips] = useState([]);
  const [loadingTask, setLoadingTask] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);

  // 🔹 Extract link & intent from navigation
  useEffect(() => {
    if (location.state?.videoLink) {
      setVideoLink(location.state.videoLink);
    }
    if (location.state?.highlight) {
      setHighlightCard(location.state.highlight);
    }
  }, [location.state]);

  // 🔹 Robust Embed URL Converter
  const getEmbedUrl = (link) => {
    if (!link || link.trim() === "") {
      return "https://www.youtube.com/embed/dQw4w9WgXcQ"; // fallback
    }

    let url = link.trim();

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    try {
      const u = new URL(url);

      // ✅ YouTube
      if (
        u.hostname.includes("youtube.com") ||
        u.hostname.includes("youtu.be") ||
        u.hostname.includes("youtube-nocookie.com")
      ) {
        const v = u.searchParams.get("v");
        if (v)
          return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;

        const parts = u.pathname.split("/").filter(Boolean);
        const maybeId = parts[parts.length - 1];
        if (maybeId)
          return `https://www.youtube.com/embed/${maybeId}?rel=0&modestbranding=1`;
      }

      // ✅ TikTok
      if (u.hostname.includes("tiktok.com")) {
        const tMatch =
          u.pathname.match(/video\/(\d+)/) || u.pathname.match(/\/t\/(\d+)/);
        const tid = tMatch ? tMatch[1] : null;
        if (tid) return `https://www.tiktok.com/embed/v2/${tid}`;
        return url;
      }

      // ✅ Direct MP4
      if (u.pathname.match(/\.(mp4|webm|ogg|mov)$/i)) {
        return url;
      }
    } catch (e) {
      console.warn("Invalid URL, falling back:", link);
    }

    // ✅ youtu.be without protocol
    const ytShort = url.match(/youtu\.be\/([A-Za-z0-9_\-]{6,})/);
    if (ytShort) {
      return `https://www.youtube.com/embed/${ytShort[1]}?rel=0&modestbranding=1`;
    }

    return url; // fallback
  };

  // 🔹 Download Handler
  const handleDownload = async (format) => {
    try {
      const res = await fetch(`/api/download/${format}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${format}-video.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("❌ Download failed");
    }
  };

  // 🔹 AI Actions
  const handleSummarize = async (link) => {
    try {
      setHighlightCard("summarize");
      setIsLoading(true);
      setLoadingTask("Summarization");
      const data = await summarizeVideo(currentUser?.token, link);
      if (data.success) {
        setSummary(data.result.summary || "No summary found");
        toast.success("✅ Summarization complete! Check My Work.");
      } else {
        toast.error("❌ Summarization failed: " + data.error);
      }
    } catch (err) {
      console.error("Summarize failed", err);
      toast.error("❌ Summarization failed. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingTask(null);
    }
  };

  const handleHighlights = async (link) => {
    try {
      setHighlightCard("highlight");
      setIsLoading(true);
      setLoadingTask("Highlight Generation");
      const data = await generateHighlights(currentUser?.token, link);
      if (data.success) {
        const h = data.result.highlights;
        setHighlights(Array.isArray(h) ? h : []);
        toast.success("✅ Highlights generated! Check My Work.");
      } else {
        toast.error("❌ Highlights failed: " + data.error);
      }
    } catch (err) {
      console.error("Highlights failed", err);
      toast.error("❌ Highlights generation failed. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingTask(null);
    }
  };

  const handleTranscribe = async (link) => {
    try {
      setHighlightCard("transcription");
      setIsLoading(true);
      setLoadingTask("Transcription");
      const data = await transcribeVideo(currentUser?.token, link);
      if (data.success) {
        setTranscription(data.result.transcription || "No transcript found");
        toast.success("✅ Transcription complete! Check My Work.");
      } else {
        toast.error("❌ Transcription failed: " + data.error);
      }
    } catch (err) {
      console.error("Transcription failed", err);
      toast.error("❌ Transcription failed. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingTask(null);
    }
  };
  const handleViralClips = async (link) => {
    try {
      setHighlightCard("clips");
      setIsLoading(true);
      setLoadingTask("Viral Clip Generation");
      const data = await generateViralClips(currentUser?.token, link);
      if (data.success) {
        const c = data.result.clips;
        setClips(Array.isArray(c) ? c : []);
        toast.success("✅ Viral clips ready! Check My Work.");
      } else {
        toast.error("❌ Viral clips failed: " + data.error);
      }
    } catch (err) {
      console.error("Viral clips failed", err);
      toast.error("❌ Viral clips generation failed. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingTask(null);
    }
  };

  // 🔹 Normalize Jarvis intents
  const normalizeIntent = (intent) => {
    const text = intent.toLowerCase().trim();
    if (["summarize", "summary"].includes(text)) return "summarize";
    if (["highlight", "highlights"].includes(text)) return "highlight";
    if (["clip", "clips", "viral", "viral clips", "shorts"].includes(text))
      return "clips";
    if (["caption", "captions", "subtitles"].includes(text)) return "captions";
    if (["transcribe", "transcription", "transcript"].includes(text))
      return "transcription";
    return null;
  };

  // 🔹 Highlight then run only if link exists
  const triggerFeature = (featureKey, actionFn, linkOverride) => {
    setActiveFeature(featureKey);

    const linkToUse = linkOverride || videoLink;

    if (linkToUse && linkToUse.trim() !== "") {
      setTimeout(() => {
        actionFn(linkToUse);
        setTimeout(() => setActiveFeature(null), 1500);
      }, 1300);
    } else {
      toast.warn("⚠️ Please paste a video link first");
      setTimeout(() => setActiveFeature(null), 1500);
    }
  };

  // 🔹 Helper to run intent
  const runIntent = (normalized, link) => {
    switch (normalized) {
      case "summarize":
        triggerFeature("summarize", handleSummarize, link);
        break;
      case "highlight":
        triggerFeature("highlight", handleHighlights, link);
        break;
      case "clips":
        triggerFeature("clips", handleViralClips, link);
        break;
      case "transcription":
        triggerFeature("transcription", handleTranscribe, link);
        break;
      case "captions":
        triggerFeature("captions", () =>
          toast.info("⚠️ Captions feature coming soon!"),
        );
        break;
      default:
        toast.error("Unknown intent");
    }
  };

  // 🔹 Jarvis Chat Integration
  const handleJarvisIntent = (intent, maybeLink) => {
    const normalized = normalizeIntent(intent);

    if (maybeLink) {
      setVideoLink(maybeLink);
      runIntent(normalized, maybeLink); // ✅ Run immediately with fresh link
    } else {
      runIntent(normalized, videoLink);
    }
  };

  // 🔹 Highlight active sidebar button
  const getGlow = (name, baseClasses) =>
    `${
      highlightCard === name
        ? "bg-gray-800 animate-pulse ring-2 ring-cyan-400"
        : "hover:bg-gray-800"
    } ${baseClasses}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex relative">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          ClipoFrameAI
        </h2>
        <nav className="mt-10 flex flex-col gap-4">
          <button
            onClick={() => triggerFeature("summarize", handleSummarize)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                activeFeature === "summarize"
                  ? "bg-gradient-to-r from-cyan-400 to-cyan-600 animate-pulse"
                  : "hover:bg-gray-700"
              }`}
          >
            <FileText size={20} className="text-cyan-400" /> Summarize
          </button>

          <button
            onClick={() => triggerFeature("highlight", handleHighlights)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                activeFeature === "highlight"
                  ? "bg-gradient-to-r from-pink-400 to-pink-600 animate-pulse"
                  : "hover:bg-gray-700"
              }`}
          >
            <Star size={20} className="text-pink-400" /> Highlights
          </button>

          <button
            onClick={() => triggerFeature("clips", handleViralClips)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                activeFeature === "clips"
                  ? "bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse"
                  : "hover:bg-gray-700"
              }`}
          >
            <Video size={20} className="text-green-400" /> Viral Clips
          </button>

          <button
            onClick={() =>
              triggerFeature("captions", () =>
                toast.info("⚠️ Captions coming soon!"),
              )
            }
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                activeFeature === "captions"
                  ? "bg-gradient-to-r from-green-400 to-green-600 animate-pulse"
                  : "hover:bg-gray-700"
              }`}
          >
            <Mic size={20} className="text-yellow-400" /> Auto-Captions
          </button>

          <button
            onClick={() => triggerFeature("transcription", handleTranscribe)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                activeFeature === "transcription"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse"
                  : "hover:bg-gray-700"
              }`}
          >
            <Mic size={20} className="text-yellow-400" /> Transcription
          </button>

          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className={getGlow(
              "download",
              "flex items-center gap-3 px-4 py-2 rounded-lg transition",
            )}
          >
            <Download size={20} className="text-purple-400" /> Download
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className={getGlow(
              "upload",
              "flex items-center gap-3 px-4 py-2 rounded-lg transition",
            )}
          >
            <Upload size={20} className="text-red-400" /> Upload
          </button>
          <Link
            to="/user-dashboard/my-work"
            className={getGlow(
              "mywork",
              "flex items-center gap-3 px-4 py-2 rounded-lg transition",
            )}
          >
            <FolderOpen size={20} className="text-blue-400" /> My Work
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-semibold">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            {currentUser?.username}
          </span>{" "}
          👋
        </h2>
        <p className="mt-2 text-gray-400">
          Paste a video link and let AI do the magic.
        </p>

        {/* Input */}
        <div className="mt-6 flex w-full max-w-xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="Paste a YouTube/TikTok link..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
          />
        </div>

        {/* Video Preview */}
        <div className="mt-8 relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-xl">
          {videoLink.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              className="w-full h-96 rounded-2xl"
              src={getEmbedUrl(videoLink)}
              controls
            />
          ) : (
            <iframe
              className="w-full h-96 rounded-2xl"
              src={getEmbedUrl(videoLink)}
              title="Video Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </div>

        {/* Results */}
        <VideoSummary summary={summary} />
        <VideoHighlights highlights={highlights} />
        <VideoTranscription transcription={transcription} />
        <ViralClips clips={clips} />
      </main>

      {/* ✅ Jarvis Floating Chat */}
      <JarvisChat onIntent={handleJarvisIntent} />

      {/* Modals */}
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
      {isDownloadModalOpen && (
        <DownloadModal
          onClose={() => setIsDownloadModalOpen(false)}
          videoLink={videoLink}
          onDownload={handleDownload}
        />
      )}
      {isLoading && loadingTask && <LoadingModal taskName={loadingTask} />}
    </div>
  );
};

export default UserDashboard;
