import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Crown, Zap, Sparkles, Rocket } from "lucide-react";

const SubscribePage = () => {
  const { currentUser } = useSelector((state) => state.user);

  const handleSubscribe = async (amount) => {
    try {
      const res = await axios.post(
        "/api/credits/add",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // ✅ token from redux
          },
        }
      );
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      console.error(err);
      alert("❌ Subscription failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold mb-6 text-center"
      >
        <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          Unlock Limitless Creativity 🎬
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-gray-400 mb-12 text-center max-w-xl text-lg"
      >
        Choose a plan that fuels your creativity and keeps the AI magic rolling
        ✨
      </motion.p>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Creator Plan */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative bg-gray-900 p-8 rounded-2xl border border-cyan-500/30 shadow-xl text-center hover:shadow-cyan-500/50 transition"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            Starter
          </div>
          <Zap className="mx-auto text-cyan-400 mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-2">Creator</h2>
          <p className="text-gray-400 mb-4">Perfect for casual users</p>
          <p className="text-4xl font-extrabold mb-6">
            $9<span className="text-lg">/month</span>
          </p>
          <button
            onClick={() => handleSubscribe(100)}
            className="bg-gradient-to-r from-cyan-500 to-pink-500 px-8 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            Subscribe — 100 Credits
          </button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative bg-gradient-to-br from-pink-600 to-purple-800 p-8 rounded-2xl border border-pink-500/40 shadow-2xl text-center hover:shadow-pink-500/70 transition"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <Crown size={16} /> Popular
          </div>
          <Sparkles className="mx-auto text-yellow-300 mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-2">Pro</h2>
          <p className="text-gray-200 mb-4">For serious creators</p>
          <p className="text-4xl font-extrabold mb-6">
            $19<span className="text-lg">/month</span>
          </p>
          <button
            onClick={() => handleSubscribe(300)}
            className="bg-black text-white px-10 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-900 transition"
          >
            Subscribe — 300 Credits
          </button>
        </motion.div>

        {/* Enterprise Plan */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative bg-gradient-to-br from-indigo-700 to-fuchsia-800 p-8 rounded-2xl border border-indigo-500/40 shadow-2xl text-center hover:shadow-indigo-500/70 transition"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-400 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <Rocket size={16} /> Enterprise
          </div>
          <Rocket className="mx-auto text-indigo-300 mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-2">Enterprise</h2>
          <p className="text-gray-200 mb-4">Unlimited AI for power users</p>
          <p className="text-4xl font-extrabold mb-6">
            $49<span className="text-lg">/month</span>
          </p>
          <button
            onClick={() => handleSubscribe(1000)}
            className="bg-gradient-to-r from-indigo-400 to-fuchsia-500 px-10 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            Subscribe — 1000 Credits
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-gray-500 text-sm"
      >
        Cancel anytime • Secure payments • Instant credit refill
      </motion.p>
    </div>
  );
};

export default SubscribePage;
