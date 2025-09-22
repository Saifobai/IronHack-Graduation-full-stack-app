// // import { Link, useNavigate } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import { useState, useMemo } from "react";
// // import { Film, Scissors, Sparkles, Type, Mic } from "lucide-react";
// // import JarvisOverlay from "../../components/JarvisOverlay";
// // import JarvisChat from "../../components/JarvisChat";

// // const Home = () => {
// //   const { currentUser } = useSelector((state) => state.user);
// //   const navigate = useNavigate();
// //   const [videoLink, setVideoLink] = useState("");
// //   const [showJarvis, setShowJarvis] = useState(true);
// //   const [highlightCard, setHighlightCard] = useState(null);

// //   const handleAnalyze = () => {
// //     if (!videoLink.trim()) return;

// //     // ✅ Check if typed text is an intent keyword
// //     const normalized = normalizeIntent(videoLink);
// //     if (normalized) {
// //       setHighlightCard(normalized);

// //       // Wait 1 second to show highlight glow, then navigate
// //       setTimeout(() => {
// //         setHighlightCard(null);
// //         navigate("/user-dashboard", { state: { highlight: normalized } });
// //       }, 1000);

// //       return; // stop, don’t treat it as a link
// //     }

// //     // ✅ Otherwise, fallback to video link navigation
// //     if (currentUser) {
// //       navigate("/user-dashboard", { state: { videoLink } });
// //     } else {
// //       navigate("/signup", { state: { videoLink } });
// //     }
// //   };

// //   // Robust parser to return a preview object:
// //   // { type: 'youtube'|'tiktok'|'mp4'|'unknown', url: '...' }
// //   const parsePreview = (link) => {
// //     if (!link || link.trim() === "") {
// //       return {
// //         type: "youtube",
// //         url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
// //       };
// //     }

// //     // normalize
// //     let url = link.trim();

// //     // If user pasted without protocol, try adding https://
// //     if (!/^https?:\/\//i.test(url)) {
// //       url = "https://" + url;
// //     }

// //     // Try using URL API
// //     try {
// //       const u = new URL(url);

// //       // YOUTUBE: watch?v=... OR youtu.be short URLs OR /embed/...
// //       if (
// //         u.hostname.includes("youtube.com") ||
// //         u.hostname.includes("youtu.be") ||
// //         u.hostname.includes("youtube-nocookie.com")
// //       ) {
// //         // try search param v
// //         const v = u.searchParams.get("v");
// //         if (v) {
// //           return {
// //             type: "youtube",
// //             url: `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`,
// //           };
// //         }
// //         // pathname might be /embed/VIDEOID or /shorts/VIDEOID
// //         const pathParts = u.pathname.split("/").filter(Boolean);
// //         const maybeId = pathParts[pathParts.length - 1];
// //         if (maybeId) {
// //           return {
// //             type: "youtube",
// //             url: `https://www.youtube.com/embed/${maybeId}?rel=0&modestbranding=1`,
// //           };
// //         }
// //       }

// //       // TIKTOK: typical path /@user/video/{id} OR /t/{id}
// //       if (u.hostname.includes("tiktok.com")) {
// //         const tMatch =
// //           u.pathname.match(/video\/(\d+)/) || u.pathname.match(/\/t\/(\d+)/);
// //         const tid = tMatch ? tMatch[1] : null;
// //         if (tid) {
// //           return {
// //             type: "tiktok",
// //             // TikTok embed endpoint
// //             url: `https://www.tiktok.com/embed/v2/${tid}`,
// //           };
// //         }
// //         // fallback to embedding the full URL (some TikTok pages still render in iframe)
// //         return { type: "tiktok", url: url };
// //       }

// //       // DIRECT MP4 or other static video file
// //       if (u.pathname && u.pathname.match(/\.(mp4|webm|ogg|mov)$/i)) {
// //         return { type: "mp4", url: url };
// //       }
// //     } catch (e) {
// //       // If URL parsing failed, still attempt simple heuristics below
// //     }

// //     // Simple heuristics:
// //     if (/\.(mp4|webm|ogg|mov)$/i.test(url)) {
// //       return { type: "mp4", url: url };
// //     }
// //     // youtu.be short URL detection
// //     const shortYt = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
// //     if (shortYt) {
// //       return {
// //         type: "youtube",
// //         url: `https://www.youtube.com/embed/${shortYt[1]}?rel=0&modestbranding=1`,
// //       };
// //     }

// //     // fallback: try iframe on the raw URL (some providers offer embeddable pages)
// //     return { type: "iframe", url };
// //   };

// //   // memoize preview so it recomputes only when videoLink changes
// //   const preview = useMemo(() => parsePreview(videoLink), [videoLink]);

// //   // Convert link to embeddable format (backwards compatibility)
// //   const getEmbedUrl = (link) => preview.url;

// //   // Feature list (unchanged)
// //   const features = [
// //     {
// //       key: "summarize",
// //       icon: Film,
// //       title: "Summaries",
// //       gradient: "from-cyan-400 to-cyan-600",
// //       text: "text-cyan-400",
// //     },
// //     {
// //       key: "highlight",
// //       icon: Scissors,
// //       title: "Highlights",
// //       gradient: "from-pink-400 to-pink-600",
// //       text: "text-pink-400",
// //     },
// //     {
// //       key: "clips",
// //       icon: Sparkles,
// //       title: "Viral Clips",
// //       gradient: "from-purple-400 to-purple-600",
// //       text: "text-green-400",
// //     },
// //     {
// //       key: "captions",
// //       icon: Type,
// //       title: "Auto-Captions",
// //       gradient: "from-green-400 to-green-600",
// //       text: "text-yellow-400",
// //     },
// //     {
// //       key: "transcription",
// //       icon: Mic,
// //       title: "Transcription",
// //       gradient: "from-yellow-400 to-yellow-600",
// //       text: "text-yellow-400",
// //     },
// //   ];

// //   // normalize intent (unchanged)
// //   const normalizeIntent = (intent) => {
// //     const text = intent.toLowerCase().trim();
// //     if (
// //       [
// //         "summarize",
// //         "summary",
// //         "summaries",
// //         "summarisation",
// //         "summarization",
// //       ].includes(text)
// //     )
// //       return "summarize";
// //     if (["highlight", "highlights", "highlighting"].includes(text))
// //       return "highlight";
// //     if (["clip", "clips", "viral", "viral clips", "shorts"].includes(text))
// //       return "clips";
// //     if (["caption", "captions", "subtitles"].includes(text)) return "captions";
// //     if (["transcribe", "transcription", "transcript"].includes(text))
// //       return "transcription";
// //     return null;
// //   };

// //   // jarvis intent handler (unchanged)
// //   // in Home.jsx
// //   const handleJarvisIntent = (intent, maybeLink = null) => {
// //     const normalized = normalizeIntent(intent);

// //     if (normalized) {
// //       if (maybeLink) {
// //         // ✅ Got intent + video link
// //         setHighlightCard(normalized);

// //         setTimeout(() => {
// //           setHighlightCard(null);
// //           navigate("/user-dashboard", {
// //             state: { highlight: normalized, videoLink: maybeLink },
// //           });
// //         }, 1500);
// //       } else {
// //         // ✅ Only intent, no link yet -> ask Jarvis to request a link
// //         return "link_required";
// //       }
// //     }
// //     return null;
// //   };

// //   // onPaste helper to ensure paste updates state immediately
// //   const handlePaste = (e) => {
// //     const text = (e.clipboardData || window.clipboardData).getData("text");
// //     if (text) setVideoLink(text);
// //   };

// //   return (
// //     <>
// //       {showJarvis && <JarvisOverlay onFinish={() => setShowJarvis(false)} />}

// //       {!showJarvis && (
// //         <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex flex-col">
// //           {/* Hero */}
// //           <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
// //             <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
// //               ClipoFrameAI
// //             </h1>
// //             <p className="mt-6 text-lg md:text-2xl max-w-2xl text-gray-300">
// //               Transform <span className="text-cyan-400">long videos</span> into
// //               <span className="text-pink-400"> summaries</span>,{" "}
// //               <span className="text-purple-400">highlights</span>, and{" "}
// //               <span className="text-green-400">viral clips</span> with AI.
// //             </p>

// //             {/* Input Box */}
// //             <div className="mt-10 flex w-full max-w-xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
// //               <input
// //                 type="text"
// //                 value={videoLink} // <- controlled
// //                 onChange={(e) => setVideoLink(e.target.value)}
// //                 placeholder="Paste a YouTube/TikTok link..."
// //                 className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
// //                 aria-label="video link"
// //               />
// //               <button
// //                 onClick={handleAnalyze}
// //                 className="bg-gradient-to-r from-cyan-500 to-pink-500 px-6 py-3 font-semibold hover:opacity-90 transition"
// //               >
// //                 Analyze
// //               </button>
// //             </div>

// //             {/* CTA */}
// //             {!currentUser ? (
// //               <div className="mt-8 space-x-4">
// //                 <Link
// //                   to="/signup"
// //                   className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold"
// //                 >
// //                   Get Started Free
// //                 </Link>
// //                 <Link
// //                   to="/signin"
// //                   className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold"
// //                 >
// //                   Sign In
// //                 </Link>
// //                 <Link
// //                   to="/subscribe"
// //                   className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg font-semibold"
// //                 >
// //                   See Pricing
// //                 </Link>
// //               </div>
// //             ) : (
// //               <div className="mt-8 space-x-4">
// //                 <Link
// //                   to="/user-dashboard"
// //                   state={{ videoLink }}
// //                   className="bg-gradient-to-r from-cyan-500 to-pink-500 px-8 py-3 rounded-2xl font-semibold shadow-md hover:opacity-90 transition"
// //                 >
// //                   Go to Dashboard
// //                 </Link>
// //                 <Link
// //                   to="/subscribe"
// //                   className="bg-purple-600 px-8 py-3 rounded-2xl font-semibold shadow-md hover:opacity-90 transition"
// //                 >
// //                   Upgrade
// //                 </Link>
// //               </div>
// //             )}
// //           </div>

// //           {/* Feature Highlights */}
// //           <section className="py-16 px-6 bg-gradient-to-br from-gray-950 to-black border-t border-gray-800">
// //             <h2 className="text-3xl font-bold text-center mb-10">
// //               Why Creators Love{" "}
// //               <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
// //                 ClipoFrameAI
// //               </span>
// //             </h2>
// //             <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
// //               {features.map((f, idx) => (
// //                 <div
// //                   key={idx}
// //                   className="relative bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition"
// //                 >
// //                   {highlightCard === f.key && (
// //                     <div
// //                       className={`absolute inset-0 rounded-2xl animate-pulse pointer-events-none bg-gradient-to-r ${f.gradient} opacity-60 blur-lg`}
// //                     />
// //                   )}
// //                   <f.icon size={36} className={`${f.text} mb-4`} />
// //                   <h3 className={`text-lg font-semibold ${f.text}`}>
// //                     {f.title}
// //                   </h3>
// //                 </div>
// //               ))}
// //             </div>
// //           </section>

// //           {/* Showcase Section with preview */}
// //           <section className="py-16 px-6 text-center">
// //             <h2 className="text-3xl font-bold mb-8">
// //               From Boring Footage ➝{" "}
// //               <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
// //                 Viral Ready
// //               </span>
// //             </h2>

// //             <div className="max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
// //               {preview.type === "mp4" ? (
// //                 <video
// //                   key={preview.url}
// //                   className="w-full h-full object-cover"
// //                   src={preview.url}
// //                   controls
// //                 />
// //               ) : (
// //                 <iframe
// //                   key={preview.url}
// //                   className="w-full h-full"
// //                   src={preview.url}
// //                   title="Demo Transformation"
// //                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// //                   allowFullScreen
// //                 />
// //               )}
// //             </div>
// //           </section>

// //           {/* Final CTA */}
// //           <section className="py-16 px-6 bg-gradient-to-r from-cyan-600 to-pink-600 text-center">
// //             <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
// //               Stop Editing for Hours — Go Viral in Minutes ⚡
// //             </h2>
// //             <div className="space-x-4">
// //               <Link
// //                 to="/signup"
// //                 className="bg-black px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-900 transition"
// //               >
// //                 Get Started Free
// //               </Link>
// //               <Link
// //                 to="/subscribe"
// //                 className="bg-white text-black px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition"
// //               >
// //                 See Pricing
// //               </Link>
// //             </div>
// //           </section>

// //           {/* Footer */}
// //           <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-800">
// //             &copy; {new Date().getFullYear()} ClipoFrameAI — Built with ❤️
// //           </footer>

// //           {/* Jarvis Assistant */}
// //           <JarvisChat onIntent={handleJarvisIntent} />
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Home;

// import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useState, useMemo } from "react";
// import { Film, Scissors, Sparkles, Type, Mic } from "lucide-react";
// import JarvisOverlay from "../../components/JarvisOverlay";
// import JarvisChat from "../../components/JarvisChat";

// const Home = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const [videoLink, setVideoLink] = useState("");
//   const [showJarvis, setShowJarvis] = useState(true);
//   const [highlightCard, setHighlightCard] = useState(null);

//   const handleAnalyze = () => {
//     if (!videoLink.trim()) return;

//     const normalized = normalizeIntent(videoLink);
//     if (normalized) {
//       setHighlightCard(normalized);
//       setTimeout(() => {
//         setHighlightCard(null);
//         navigate("/user-dashboard", { state: { highlight: normalized } });
//       }, 1000);
//       return;
//     }

//     if (currentUser) {
//       navigate("/user-dashboard", { state: { videoLink } });
//     } else {
//       navigate("/signup", { state: { videoLink } });
//     }
//   };

//   const parsePreview = (link) => {
//     if (!link || link.trim() === "") {
//       return {
//         type: "youtube",
//         url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//       };
//     }

//     let url = link.trim();
//     if (!/^https?:\/\//i.test(url)) {
//       url = "https://" + url;
//     }

//     try {
//       const u = new URL(url);

//       if (
//         u.hostname.includes("youtube.com") ||
//         u.hostname.includes("youtu.be") ||
//         u.hostname.includes("youtube-nocookie.com")
//       ) {
//         const v = u.searchParams.get("v");
//         if (v) {
//           return {
//             type: "youtube",
//             url: `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`,
//           };
//         }
//         const pathParts = u.pathname.split("/").filter(Boolean);
//         const maybeId = pathParts[pathParts.length - 1];
//         if (maybeId) {
//           return {
//             type: "youtube",
//             url: `https://www.youtube.com/embed/${maybeId}?rel=0&modestbranding=1`,
//           };
//         }
//       }

//       if (u.hostname.includes("tiktok.com")) {
//         const tMatch =
//           u.pathname.match(/video\/(\d+)/) || u.pathname.match(/\/t\/(\d+)/);
//         const tid = tMatch ? tMatch[1] : null;
//         if (tid) {
//           return {
//             type: "tiktok",
//             url: `https://www.tiktok.com/embed/v2/${tid}`,
//           };
//         }
//         return { type: "tiktok", url: url };
//       }

//       if (u.pathname && u.pathname.match(/\.(mp4|webm|ogg|mov)$/i)) {
//         return { type: "mp4", url: url };
//       }
//     } catch (e) {}

//     if (/\.(mp4|webm|ogg|mov)$/i.test(url)) {
//       return { type: "mp4", url: url };
//     }

//     const shortYt = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
//     if (shortYt) {
//       return {
//         type: "youtube",
//         url: `https://www.youtube.com/embed/${shortYt[1]}?rel=0&modestbranding=1`,
//       };
//     }

//     return { type: "iframe", url };
//   };

//   const preview = useMemo(() => parsePreview(videoLink), [videoLink]);

//   const features = [
//     {
//       key: "summarize",
//       icon: Film,
//       title: "Summaries",
//       gradient: "from-cyan-400 to-cyan-600",
//       text: "text-cyan-400",
//     },
//     {
//       key: "highlight",
//       icon: Scissors,
//       title: "Highlights",
//       gradient: "from-pink-400 to-pink-600",
//       text: "text-pink-400",
//     },
//     {
//       key: "clips",
//       icon: Sparkles,
//       title: "Viral Clips",
//       gradient: "from-purple-400 to-purple-600",
//       text: "text-green-400",
//     },
//     {
//       key: "captions",
//       icon: Type,
//       title: "Auto-Captions",
//       gradient: "from-green-400 to-green-600",
//       text: "text-yellow-400",
//     },
//     {
//       key: "transcription",
//       icon: Mic,
//       title: "Transcription",
//       gradient: "from-yellow-400 to-yellow-600",
//       text: "text-yellow-400",
//     },
//   ];

//   const normalizeIntent = (intent) => {
//     const text = intent.toLowerCase().trim();
//     if (
//       [
//         "summarize",
//         "summary",
//         "summaries",
//         "summarisation",
//         "summarization",
//       ].includes(text)
//     )
//       return "summarize";
//     if (["highlight", "highlights", "highlighting"].includes(text))
//       return "highlight";
//     if (["clip", "clips", "viral", "viral clips", "shorts"].includes(text))
//       return "clips";
//     if (["caption", "captions", "subtitles"].includes(text)) return "captions";
//     if (["transcribe", "transcription", "transcript"].includes(text))
//       return "transcription";
//     return null;
//   };

//   const handleJarvisIntent = (intent, maybeLink = null) => {
//     const normalized = normalizeIntent(intent);

//     if (normalized) {
//       navigate("/user-dashboard", {
//         state: { highlight: normalized, videoLink: maybeLink },
//       });
//     }
//     return null;
//   };

//   return (
//     <>
//       {showJarvis && <JarvisOverlay onFinish={() => setShowJarvis(false)} />}

//       {!showJarvis && (
//         <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex flex-col">
//           {/* Hero Section */}
//           <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
//             <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
//               ClipoFrameAI
//             </h1>
//             <p className="mt-6 text-lg md:text-2xl max-w-2xl text-gray-300">
//               Transform <span className="text-cyan-400">long videos</span> into
//               <span className="text-pink-400"> summaries</span>,{" "}
//               <span className="text-purple-400">highlights</span>, and{" "}
//               <span className="text-green-400">viral clips</span> with AI.
//             </p>

//             {/* Input */}
//             <div className="mt-10 flex w-full max-w-xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
//               <input
//                 type="text"
//                 value={videoLink}
//                 onChange={(e) => setVideoLink(e.target.value)}
//                 placeholder="Paste a YouTube/TikTok link..."
//                 className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
//                 aria-label="video link"
//               />
//               <button
//                 onClick={handleAnalyze}
//                 className="bg-gradient-to-r from-cyan-500 to-pink-500 px-6 py-3 font-semibold hover:opacity-90 transition"
//               >
//                 Analyze
//               </button>
//             </div>
//           </div>

//           {/* Features */}
//           <section className="py-16 px-6 bg-gradient-to-br from-gray-950 to-black border-t border-gray-800">
//             <h2 className="text-3xl font-bold text-center mb-10">
//               Why Creators Love{" "}
//               <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
//                 ClipoFrameAI
//               </span>
//             </h2>
//             <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
//               {features.map((f, idx) => (
//                 <div
//                   key={idx}
//                   className="relative bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition"
//                 >
//                   {highlightCard === f.key && (
//                     <div
//                       className={`absolute inset-0 rounded-2xl animate-pulse pointer-events-none bg-gradient-to-r ${f.gradient} opacity-60 blur-lg`}
//                     />
//                   )}
//                   <f.icon size={36} className={`${f.text} mb-4`} />
//                   <h3 className={`text-lg font-semibold ${f.text}`}>
//                     {f.title}
//                   </h3>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Preview */}
//           <section className="py-16 px-6 text-center">
//             <h2 className="text-3xl font-bold mb-8">
//               From Boring Footage ➝{" "}
//               <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
//                 Viral Ready
//               </span>
//             </h2>

//             <div className="max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
//               {preview.type === "mp4" ? (
//                 <video
//                   key={preview.url}
//                   className="w-full h-full object-cover"
//                   src={preview.url}
//                   controls
//                 />
//               ) : (
//                 <iframe
//                   key={preview.url}
//                   className="w-full h-full"
//                   src={preview.url}
//                   title="Demo Transformation"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//               )}
//             </div>
//           </section>

//           {/* Footer */}
//           <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-800">
//             &copy; {new Date().getFullYear()} ClipoFrameAI — Built with ❤️
//           </footer>

//           {/* Jarvis Chat */}
//           <JarvisChat onIntent={handleJarvisIntent} />
//         </div>
//       )}
//     </>
//   );
// };

// export default Home;

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
