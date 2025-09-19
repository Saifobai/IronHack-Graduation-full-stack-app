import { useState } from "react";
import { motion } from "framer-motion";

const DockedJarvis = ({ onIntent }) => {
  const [messages, setMessages] = useState([
    { from: "jarvis", text: "👋 Hello, I’m Jarvis. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.toLowerCase().trim();
    let newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let response = "";
      let intent = null;

      if (
        userMsg.includes("summarize") ||
        userMsg.includes("summary") ||
        userMsg.includes("summaries")
      ) {
        response = "✅ Summarize card highlighted… redirecting shortly.";
        intent = "summarize";
      } else if (
        userMsg.includes("highlight") ||
        userMsg.includes("highlights")
      ) {
        response = "✨ Highlighting Highlights section for you.";
        intent = "highlight";
      } else if (
        userMsg.includes("clip") ||
        userMsg.includes("clips") ||
        userMsg.includes("viral")
      ) {
        response = "🎬 Viral Clips card activated.";
        intent = "clips";
      } else if (
        userMsg.includes("auto") ||
        userMsg.includes("caption") ||
        userMsg.includes("captions")
      ) {
        response = "🎬 Auto Captions card activated.";
        intent = "captions";
      } else if (
        userMsg.includes("transcript") ||
        userMsg.includes("transcripts") ||
        userMsg.includes("transcriptions")
      ) {
        response = "🎬 Auto Transcriptions card activated.";
        intent = "transcription";
      } else {
        response =
          "🤔 I didn’t catch that. Try **summarize**, **highlight**, or **clips**.";
      }

      setMessages((prev) => [...prev, { from: "jarvis", text: response }]);
      setIsTyping(false);

      if (intent) onIntent(intent);
    }, 1500); // ⏳ delay before Jarvis answers
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-gray-900/90 rounded-2xl shadow-2xl border border-cyan-400 z-40">
      {/* Messages */}
      <div className="p-4 h-64 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.from === "jarvis"
                ? "bg-cyan-800/40 text-cyan-200 self-start"
                : "bg-gray-700 text-white self-end ml-auto"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex items-center space-x-1 text-cyan-400 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <span>Jarvis is thinking</span>
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ...
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Jarvis..."
          className="flex-1 bg-transparent px-3 py-2 text-white outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DockedJarvis;
