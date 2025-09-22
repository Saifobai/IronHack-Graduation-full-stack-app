import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { Film, Scissors, Sparkles, Type, Mic } from "lucide-react";
import JarvisOverlay from "../../components/JarvisOverlay";
import JarvisChat from "../../components/JarvisChat";
import {
  summarizeVideo,
  generateHighlights,
  transcribeVideo,
  generateViralClips,
} from "../../services//jarvisApi";
import LoadingModal from "../../components/LandingModal";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [videoLink, setVideoLink] = useState("");
  const [showJarvis, setShowJarvis] = useState(true);
  const [highlightCard, setHighlightCard] = useState(null);
  const [loadingFeature, setLoadingFeature] = useState(null);

  const handleAnalyze = () => {
    if (!videoLink.trim()) return;

    const normalized = normalizeIntent(videoLink);
    if (normalized) {
      setHighlightCard(normalized);
      setTimeout(() => {
        setHighlightCard(null);
        navigate("/user-dashboard", { state: { highlight: normalized } });
      }, 1000);
      return;
    }

    if (currentUser) {
      navigate("/user-dashboard", { state: { videoLink } });
    } else {
      navigate("/signup", { state: { videoLink } });
    }
  };

  const parsePreview = (link) => {
    if (!link || link.trim() === "") {
      return {
        type: "youtube",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      };
    }

    let url = link.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    try {
      const u = new URL(url);

      if (
        u.hostname.includes("youtube.com") ||
        u.hostname.includes("youtu.be") ||
        u.hostname.includes("youtube-nocookie.com")
      ) {
        const v = u.searchParams.get("v");
        if (v) {
          return {
            type: "youtube",
            url: `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`,
          };
        }
        const pathParts = u.pathname.split("/").filter(Boolean);
        const maybeId = pathParts[pathParts.length - 1];
        if (maybeId) {
          return {
            type: "youtube",
            url: `https://www.youtube.com/embed/${maybeId}?rel=0&modestbranding=1`,
          };
        }
      }

      if (u.hostname.includes("tiktok.com")) {
        const tMatch =
          u.pathname.match(/video\/(\d+)/) || u.pathname.match(/\/t\/(\d+)/);
        const tid = tMatch ? tMatch[1] : null;
        if (tid) {
          return {
            type: "tiktok",
            url: `https://www.tiktok.com/embed/v2/${tid}`,
          };
        }
        return { type: "tiktok", url: url };
      }

      if (u.pathname && u.pathname.match(/\.(mp4|webm|ogg|mov)$/i)) {
        return { type: "mp4", url: url };
      }
    } catch (e) {}

    if (/\.(mp4|webm|ogg|mov)$/i.test(url)) {
      return { type: "mp4", url: url };
    }

    const shortYt = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
    if (shortYt) {
      return {
        type: "youtube",
        url: `https://www.youtube.com/embed/${shortYt[1]}?rel=0&modestbranding=1`,
      };
    }

    return { type: "iframe", url };
  };

  const preview = useMemo(() => parsePreview(videoLink), [videoLink]);

  const features = [
    {
      key: "summarize",
      icon: Film,
      title: "Summaries",
      gradient: "from-cyan-400 to-cyan-600",
      text: "text-cyan-400",
    },
    {
      key: "highlight",
      icon: Scissors,
      title: "Highlights",
      gradient: "from-pink-400 to-pink-600",
      text: "text-pink-400",
    },
    {
      key: "clips",
      icon: Sparkles,
      title: "Viral Clips",
      gradient: "from-purple-400 to-purple-600",
      text: "text-purple-400",
    },
    {
      key: "captions",
      icon: Type,
      title: "Auto-Captions",
      gradient: "from-green-400 to-green-600",
      text: "text-green-400",
    },
    {
      key: "transcription",
      icon: Mic,
      title: "Transcription",
      gradient: "from-yellow-400 to-yellow-600",
      text: "text-yellow-400",
    },
  ];

  const normalizeIntent = (intent) => {
    const text = intent.toLowerCase().trim();
    if (
      [
        "summarize",
        "summary",
        "summaries",
        "summarisation",
        "summarization",
      ].includes(text)
    )
      return "summarize";
    if (["highlight", "highlights", "highlighting"].includes(text))
      return "highlight";
    if (["clip", "clips", "viral", "viral clips", "shorts"].includes(text))
      return "clips";
    if (["caption", "captions", "subtitles"].includes(text)) return "captions";
    if (["transcribe", "transcription", "transcript"].includes(text))
      return "transcription";
    return null;
  };

  const handleJarvisIntent = async (intent, maybeLink = null) => {
    const normalized = normalizeIntent(intent);
    const linkToUse = maybeLink || videoLink;

    if (!normalized || !linkToUse) return;

    setHighlightCard(normalized);

    setTimeout(async () => {
      setLoadingFeature(normalized);

      try {
        if (normalized === "summarize") {
          await summarizeVideo(currentUser?.token, linkToUse);
        } else if (normalized === "highlight") {
          await generateHighlights(currentUser?.token, linkToUse);
        } else if (normalized === "clips") {
          await generateViralClips(currentUser?.token, linkToUse);
        } else if (normalized === "transcription") {
          await transcribeVideo(currentUser?.token, linkToUse);
        }

        // ✅ After success → go to mywork page
        navigate("/user-dashboard/my-work");
      } catch (error) {
        console.error("❌ Jarvis API failed:", error);
        // optional toast here
      } finally {
        setLoadingFeature(null);
        setHighlightCard(null);
      }
    }, 1200);
  };

  return (
    <>
      {showJarvis && <JarvisOverlay onFinish={() => setShowJarvis(false)} />}

      {!showJarvis && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex flex-col">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
              ClipoFrameAI
            </h1>
            <p className="mt-6 text-lg md:text-2xl max-w-2xl text-gray-300">
              Transform <span className="text-cyan-400">long videos</span> into
              <span className="text-pink-400"> summaries</span>,{" "}
              <span className="text-purple-400">highlights</span>, and{" "}
              <span className="text-green-400">viral clips</span> with AI.
            </p>

            {/* Input */}
            <div className="mt-10 flex w-full max-w-xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <input
                type="text"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="Paste a YouTube/TikTok link..."
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
                aria-label="video link"
              />
              <button
                onClick={handleAnalyze}
                className="bg-gradient-to-r from-cyan-500 to-pink-500 px-6 py-3 font-semibold hover:opacity-90 transition"
              >
                Analyze
              </button>
            </div>
          </div>

          {/* Features */}
          <section className="py-16 px-6 bg-gradient-to-br from-gray-950 to-black border-t border-gray-800">
            <h2 className="text-3xl font-bold text-center mb-10">
              Why Creators Love{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                ClipoFrameAI
              </span>
            </h2>
            <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {features.map((f, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition"
                >
                  {highlightCard === f.key && (
                    <div
                      className={`absolute inset-0 rounded-2xl animate-pulse pointer-events-none bg-gradient-to-r ${f.gradient} opacity-60 blur-lg`}
                    />
                  )}
                  <f.icon size={36} className={`${f.text} mb-4`} />
                  <h3 className={`text-lg font-semibold ${f.text}`}>
                    {f.title}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          {/* Preview */}
          <section className="py-16 px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">
              From Boring Footage ➝{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                Viral Ready
              </span>
            </h2>

            <div className="max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
              {preview.type === "mp4" ? (
                <video
                  key={preview.url}
                  className="w-full h-full object-cover"
                  src={preview.url}
                  controls
                />
              ) : (
                <iframe
                  key={preview.url}
                  className="w-full h-full"
                  src={preview.url}
                  title="Demo Transformation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-800">
            &copy; {new Date().getFullYear()} ClipoFrameAI — Built with ❤️
          </footer>

          {/* Jarvis Chat */}
          <JarvisChat onIntent={handleJarvisIntent} />

          {loadingFeature && <LoadingModal taskName={loadingFeature} />}
        </div>
      )}
    </>
  );
};

export default Home;
