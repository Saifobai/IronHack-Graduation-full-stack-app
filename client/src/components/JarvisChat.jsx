import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Send, X, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { jarvisChat } from "../services/jarvisApi";

const JarvisChat = ({ onIntent }) => {
  const { currentUser } = useSelector((s) => s.user);

  const [messages, setMessages] = useState([
    {
      from: "jarvis",
      text: `👋 Hello, I’m Jarvis!  
I can chat with you, or help with: summarize, highlight, clips, captions, and transcription.  
Just talk to me or paste a link!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(true);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // States for link+intent workflow
  const [lastVideoLink, setLastVideoLink] = useState(null);
  const [pendingIntent, setPendingIntent] = useState(null);

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

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { from: "jarvis", text }]);
  };

  // 💬 Handle Sending Message
  const handleSend = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setIsTyping(true);

    // Detect intent + link
    const intent = detectIntent(text);
    const videoRegex = /(https?:\/\/[^\s]+)/g;
    const foundLink = text.match(videoRegex)?.[0];

    // ✅ Case A: we already asked for a link, now user sends it
    if (pendingIntent && foundLink) {
      setLastVideoLink(foundLink);
      onIntent(pendingIntent, foundLink);
      addBotMessage(`✅ Running ${pendingIntent} on your video...`);
      setPendingIntent(null);
      setIsTyping(false);
      return;
    }

    // ✅ Case B: user pastes a link first
    if (!pendingIntent && foundLink) {
      setLastVideoLink(foundLink);
      addBotMessage(
        "🎥 Nice link! Do you want me to summarize, highlight, clip, caption, or transcribe it?"
      );
      setIsTyping(false);
      return;
    }

    // ✅ Case C: user gives intent, and we already have a link
    if (intent && lastVideoLink) {
      onIntent(intent, lastVideoLink);
      addBotMessage(`✅ Running ${intent} on your video...`);
      setPendingIntent(null);
      setIsTyping(false);
      return;
    }

    // ✅ Case D: user gives intent, but no link yet
    if (intent && !lastVideoLink) {
      setPendingIntent(intent);
      addBotMessage(
        `Got it! Please paste a link so I can ${intent} it for you.`
      );
      setIsTyping(false);
      return;
    }

    // ✅ Case E: normal chat (no intent, no link)
    try {
      const data = await jarvisChat(currentUser?.token, text);
      addBotMessage(
        data.result?.response ||
          data.result?.reply ||
          data.message ||
          "⚠️ No response."
      );
    } catch (error) {
      console.error("Chat failed:", error);
      addBotMessage("❌ Something went wrong. Please try again.");
    }

    setIsTyping(false);
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
