// src/components/LoadingModal.jsx
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const LoadingModal = ({ taskName }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900/95 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-cyan-500/60"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="flex justify-center mb-4"
        >
          <Loader2 className="w-12 h-12 text-cyan-400" />
        </motion.div>

        <h2 className="text-xl font-bold text-cyan-300 mb-2">
          {taskName} in progress...
        </h2>

        <motion.p
          className="text-gray-400 text-sm"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Please wait while Jarvis processes your request.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingModal;
