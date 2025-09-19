// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { Mic, MicOff, Send } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const FEATURES = [
//   { key: "summarize", label: "Summaries" },
//   { key: "highlight", label: "Highlights" },
//   { key: "clips", label: "Viral Clips" },
//   { key: "captions", label: "Auto-Captions" },
//   { key: "transcription", label: "Transcription" },
// ];

// const JarvisChat = ({ onIntent }) => {
//   const { currentUser } = useSelector((s) => s.user);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isDashboard = location.pathname.includes("dashboard");

//   const [messages, setMessages] = useState([
//     {
//       from: "jarvis",
//       text: `👋 Hello, I’m Jarvis!
// I can help with: ${FEATURES.map((f) => f.label).join(", ")}.
// Just type or say one of them to get started!`,
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [listening, setListening] = useState(false);
//   const recognitionRef = useRef(null);

//   // 🎤 Setup Web Speech API
//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = "en-US";

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         handleSend(transcript);
//         setListening(false);
//       };

//       recognition.onerror = () => setListening(false);
//       recognition.onend = () => setListening(false);

//       recognitionRef.current = recognition;
//     }
//   }, []);

//   const startListening = () => {
//     if (recognitionRef.current && !listening) {
//       setListening(true);
//       recognitionRef.current.start();
//     }
//   };

//   // 🔎 Intent Detection
//   const detectIntent = (text) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("summarize") || lower.includes("summary"))
//       return "summarize";
//     if (lower.includes("highlight")) return "highlight";
//     if (lower.includes("clip") || lower.includes("viral")) return "clips";
//     if (lower.includes("caption")) return "captions";
//     if (lower.includes("transcript")) return "transcription";
//     return null;
//   };

//   // 💬 Handle Sending Message
//   const handleSend = async (msg) => {
//     const text = msg || input.trim();
//     if (!text) return;

//     setMessages((prev) => [...prev, { from: "user", text }]);
//     setInput("");
//     setIsTyping(true);

//     const intent = detectIntent(text);

//     if (intent) {
//       // ✅ Feature Intent Detected
//       if (isDashboard) {
//         // On Dashboard → highlight + trigger action
//         onIntent && onIntent(intent);
//         setMessages((prev) => [
//           ...prev,
//           { from: "jarvis", text: `✅ Triggered ${intent} for you!` },
//         ]);
//       } else {
//         // On Home → highlight + navigate
//         onIntent && onIntent(intent);
//         setMessages((prev) => [
//           ...prev,
//           {
//             from: "jarvis",
//             text: `✨ Great choice! Redirecting you to ${intent}...`,
//           },
//         ]);
//         setTimeout(() => {
//           navigate("/user-dashboard", { state: { highlight: intent } });
//         }, 2000);
//       }
//       setIsTyping(false);
//       return;
//     }

//     // 🤖 Otherwise → Chat with backend
//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: currentUser?.token
//             ? `Bearer ${currentUser.token}`
//             : "",
//         },
//         body: JSON.stringify({ message: text }),
//       });

//       let data = null;
//       try {
//         data = await res.json();
//       } catch {
//         data = null;
//       }

//       if (res.ok && (data?.response || data?.result)) {
//         setMessages((prev) => [
//           ...prev,
//           { from: "jarvis", text: data.response || data.result },
//         ]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           { from: "jarvis", text: data?.error || "❌ Something went wrong." },
//         ]);
//       }
//     } catch (err) {
//       console.error("Chat failed:", err);
//       setMessages((prev) => [
//         ...prev,
//         { from: "jarvis", text: "⚠️ Server error. Try again later." },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 w-80 bg-gray-900/90 rounded-2xl shadow-2xl border border-cyan-400 z-40 flex flex-col">
//       {/* Messages */}
//       <div className="p-4 h-72 overflow-y-auto space-y-3">
//         {messages.map((msg, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className={`p-3 rounded-xl max-w-[80%] whitespace-pre-line ${
//               msg.from === "jarvis"
//                 ? "bg-cyan-800/40 text-cyan-200 self-start"
//                 : "bg-gray-700 text-white self-end ml-auto"
//             }`}
//           >
//             {msg.text}
//           </motion.div>
//         ))}

//         {isTyping && (
//           <motion.div
//             className="text-cyan-400 font-mono"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ repeat: Infinity, duration: 1 }}
//           >
//             Jarvis is thinking...
//           </motion.div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="flex items-center border-t border-gray-700">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask Jarvis..."
//           className="flex-1 bg-transparent px-3 py-2 text-white outline-none"
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={() => handleSend()}
//           className="px-3 py-2 hover:bg-gray-800 transition"
//         >
//           <Send size={18} />
//         </button>
//         <button
//           onClick={startListening}
//           className={`px-3 py-2 ${
//             listening ? "text-red-400" : "text-cyan-400"
//           }`}
//         >
//           {listening ? <MicOff size={18} /> : <Mic size={18} />}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JarvisChat;

//=============================================================
// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { Mic, MicOff, Send, X, MessageCircle } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { jarvisChat } from "../services/jarvisApi";

// const FEATURES = [
//   { key: "summarize", label: "Summaries" },
//   { key: "highlight", label: "Highlights" },
//   { key: "clips", label: "Viral Clips" },
//   { key: "captions", label: "Auto-Captions" },
//   { key: "transcription", label: "Transcription" },
// ];

// const JarvisChat = ({ onIntent }) => {
//   const { currentUser } = useSelector((s) => s.user);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isDashboard = location.pathname.includes("dashboard");

//   const [messages, setMessages] = useState([
//     {
//       from: "jarvis",
//       text: `👋 Hello, I’m Jarvis!
// I can help with: ${FEATURES.map((f) => f.label).join(", ")}.
// Just type or say one of them to get started!`,
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [open, setOpen] = useState(true); // 👈 new state for open/close
//   const recognitionRef = useRef(null);

//   // 🎤 Setup Web Speech API
//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = "en-US";

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         handleSend(transcript);
//         setListening(false);
//       };

//       recognition.onerror = () => setListening(false);
//       recognition.onend = () => setListening(false);

//       recognitionRef.current = recognition;
//     }
//   }, []);

//   const startListening = () => {
//     if (recognitionRef.current && !listening) {
//       setListening(true);
//       recognitionRef.current.start();
//     }
//   };

//   // 🔎 Intent Detection
//   const detectIntent = (text) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("summarize") || lower.includes("summary"))
//       return "summarize";
//     if (lower.includes("highlight")) return "highlight";
//     if (lower.includes("clip") || lower.includes("viral")) return "clips";
//     if (lower.includes("caption")) return "captions";
//     if (lower.includes("transcript")) return "transcription";
//     return null;
//   };

//   // 💬 Handle Sending Message

//   const handleSend = async (msg, videoUrl = null, videoId = null) => {
//     const text = msg || input.trim();
//     if (!text) return;

//     setMessages((prev) => [...prev, { from: "user", text }]);
//     setInput("");
//     setIsTyping(true);

//     try {
//       const data = await jarvisChat({
//         message: text,
//         videoUrl,
//         videoId,
//         token: currentUser?.token,
//       });

//       const botReply =
//         typeof data.result === "string"
//           ? data.result
//           : data.result?.response || JSON.stringify(data.result);

//       setMessages((prev) => [...prev, { from: "jarvis", text: botReply }]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { from: "jarvis", text: err.message || "⚠️ Server error." },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // 🚀 Floating Chat UI
//   if (!open) {
//     return (
//       <button
//         onClick={() => setOpen(true)}
//         className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-cyan-600 flex items-center justify-center shadow-xl hover:scale-110 transition z-40"
//       >
//         <MessageCircle size={28} className="text-white" />
//       </button>
//     );
//   }

//   return (
//     <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-gray-900/95 rounded-2xl shadow-2xl border border-cyan-400 z-40 flex flex-col">
//       {/* Header */}
//       <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
//         <span className="text-cyan-400 font-bold">🤖 Jarvis Assistant</span>
//         <button
//           onClick={() => setOpen(false)}
//           className="text-gray-400 hover:text-red-400"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="p-4 flex-1 overflow-y-auto space-y-3">
//         {messages.map((msg, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className={`p-3 rounded-xl max-w-[80%] whitespace-pre-line ${
//               msg.from === "jarvis"
//                 ? "bg-cyan-800/40 text-cyan-200 self-start"
//                 : "bg-gray-700 text-white self-end ml-auto"
//             }`}
//           >
//             {msg.text}
//           </motion.div>
//         ))}

//         {isTyping && (
//           <motion.div
//             className="text-cyan-400 font-mono"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ repeat: Infinity, duration: 1 }}
//           >
//             Jarvis is thinking...
//           </motion.div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="flex items-center border-t border-gray-700">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask Jarvis..."
//           className="flex-1 bg-transparent px-3 py-2 text-white outline-none"
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={() => handleSend()}
//           className="px-3 py-2 hover:bg-gray-800 transition"
//         >
//           <Send size={18} />
//         </button>
//         <button
//           onClick={startListening}
//           className={`px-3 py-2 ${
//             listening ? "text-red-400" : "text-cyan-400"
//           }`}
//         >
//           {listening ? <MicOff size={18} /> : <Mic size={18} />}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JarvisChat;

//=============================================================

// src/components/JarvisChat.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Send, X, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import {
  jarvisChat,
  summarizeVideo,
  generateHighlights,
  transcribeVideo,
  generateViralClips,
} from "../services/jarvisApi";

const FEATURES = [
  { key: "summarize", label: "Summaries" },
  { key: "highlight", label: "Highlights" },
  { key: "clips", label: "Viral Clips" },
  { key: "captions", label: "Auto-Captions" },
  { key: "transcription", label: "Transcription" },
];

const JarvisChat = ({ onIntent }) => {
  const { currentUser } = useSelector((s) => s.user);

  const [messages, setMessages] = useState([
    {
      from: "jarvis",
      text: `👋 Hello, I’m Jarvis!  
I can help with: ${FEATURES.map((f) => f.label).join(", ")}.  
Paste a link or just tell me what you want!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(true);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // ✅ Remember last video link
  const [lastVideoLink, setLastVideoLink] = useState(null);

  // 🎤 Setup Web Speech API
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
        setListening(false);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  // 🔎 Intent Detection
  const detectIntent = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("summarize") || lower.includes("summary"))
      return "summarize";
    if (lower.includes("highlight")) return "highlight";
    if (lower.includes("clip") || lower.includes("viral")) return "clips";
    if (lower.includes("caption")) return "captions";
    if (lower.includes("transcript")) return "transcription";
    return null;
  };

  // 💬 Handle Sending Message
  // 💬 Handle Sending Message
  const handleSend = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setIsTyping(true);

    const intent = detectIntent(text);

    // ✅ Detect video link
    const videoRegex = /(https?:\/\/[^\s]+)/g;
    const foundLink = text.match(videoRegex)?.[0];
    if (foundLink) {
      setLastVideoLink(foundLink);
    }

    const linkToUse = foundLink || lastVideoLink;

    try {
      let data;

      if (intent && linkToUse) {
        // ✅ Feature-based calls
        if (intent === "summarize") {
          data = await summarizeVideo(currentUser?.token, linkToUse);
          setMessages((prev) => [
            ...prev,
            {
              from: "jarvis",
              text: data.result?.summary || "⚠️ No summary found.",
            },
          ]);
        } else if (intent === "highlight") {
          data = await generateHighlights(currentUser?.token, linkToUse);
          setMessages((prev) => [
            ...prev,
            {
              from: "jarvis",
              text:
                data.result?.highlights?.join("\n") ||
                "⚠️ No highlights found.",
            },
          ]);
        } else if (intent === "transcription") {
          data = await transcribeVideo(currentUser?.token, linkToUse);
          setMessages((prev) => [
            ...prev,
            {
              from: "jarvis",
              text: data.result?.transcription || "⚠️ No transcript found.",
            },
          ]);
        } else if (intent === "clips") {
          data = await generateViralClips(currentUser?.token, linkToUse);
          setMessages((prev) => [
            ...prev,
            {
              from: "jarvis",
              text:
                (data.result?.clips || []).join("\n") || "⚠️ No clips found.",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { from: "jarvis", text: "❌ Feature coming soon!" },
          ]);
        }
      } else {
        // ✅ General Chat (fix is here)
        data = await jarvisChat(currentUser?.token, text, linkToUse);
        console.log("🔍 Full response from backend:", data);
        setMessages((prev) => [
          ...prev,
          {
            from: "jarvis",
            text:
              data.result?.response ||
              data.result?.reply ||
              data.message ||
              "⚠️ No response.",
          },
        ]);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Chat failed:", error);
      setMessages((prev) => [
        ...prev,
        { from: "jarvis", text: "❌ Something went wrong. Please try again." },
      ]);
      setIsTyping(false);
    }
  };

  // 🚀 Floating Chat UI
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-cyan-600 flex items-center justify-center shadow-xl hover:scale-110 transition z-40"
      >
        <MessageCircle size={28} className="text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-gray-900/95 rounded-2xl shadow-2xl border border-cyan-400 z-40 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
        <span className="text-cyan-400 font-bold">🤖 Jarvis Assistant</span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-red-400"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl max-w-[80%] whitespace-pre-line ${
              msg.from === "jarvis"
                ? "bg-cyan-800/40 text-cyan-200 self-start"
                : "bg-gray-700 text-white self-end ml-auto"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            className="text-cyan-400 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            Jarvis is thinking...
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Jarvis..."
          className="flex-1 bg-transparent px-3 py-2 text-white outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          className="px-3 py-2 hover:bg-gray-800 transition"
        >
          <Send size={18} />
        </button>
        <button
          onClick={startListening}
          className={`px-3 py-2 ${
            listening ? "text-red-400" : "text-cyan-400"
          }`}
        >
          {listening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      </div>
    </div>
  );
};

export default JarvisChat;
