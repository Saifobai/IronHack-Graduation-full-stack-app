// src/components/LoadingModal.jsx
import { Loader2 } from "lucide-react";

const LoadingModal = ({ taskName }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-cyan-500">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          {taskName} in progress...
        </h2>
        <p className="text-gray-400 text-sm">
          Please wait while Jarvis processes your request.
        </p>
      </div>
    </div>
  );
};

export default LoadingModal;
