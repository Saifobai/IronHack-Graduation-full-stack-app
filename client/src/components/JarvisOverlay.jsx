import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AlienJarvisOverlay = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const messages = ["✨ Welcome, traveler. Let’s create the future together."];

  useEffect(() => {
    if (step < messages.length) {
      const timer = setTimeout(() => setStep(step + 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(onFinish, 1500);
      return () => clearTimeout(finishTimer);
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: step >= messages.length ? 0 : 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center overflow-hidden"
    >
      {/* Floating Orb */}
      <motion.div
        className="relative w-60 h-60 rounded-full flex items-center justify-center"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        {/* Inner Core */}
        <div className="absolute w-32 h-32 rounded-full bg-cyan-500/30 border border-cyan-400 shadow-[0_0_80px_40px_rgba(0,255,255,0.5)] animate-pulse" />

        {/* Pulsating Aura */}
        <motion.div
          className="absolute w-56 h-56 rounded-full border border-fuchsia-400/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />

        {/* Floating Alien Glyphs */}
        {["☉", "✦", "𓂀", "۞", "◉", "⊛"].map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute text-fuchsia-400 text-2xl font-mono"
            style={{
              transform: `rotate(${i * 60}deg) translate(140px) rotate(-${
                i * 60
              }deg)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {symbol}
          </motion.div>
        ))}

        {/* Jarvis Label */}
        <span className="text-cyan-200 font-mono text-2xl z-10 tracking-widest">
          JΛRVIS
        </span>

        {/* Energy Tendrils (lightning arcs) */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-32 bg-gradient-to-b from-cyan-400 via-fuchsia-400 to-transparent opacity-70"
            style={{
              transform: `rotate(${i * 90}deg) translate(0, -80px)`,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>

      {/* Console Messages */}
      <div className="absolute bottom-16 w-full text-center px-6">
        {messages.slice(0, step + 1).map((msg, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.5 }}
            className="text-lg md:text-xl font-mono text-fuchsia-300 drop-shadow-lg"
          >
            {msg}
          </motion.p>
        ))}
      </div>

      {/* Random floating particles (stardust) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              y: [Math.random() * window.innerHeight, -20],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AlienJarvisOverlay;
