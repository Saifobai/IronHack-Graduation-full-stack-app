import { useState } from "react";

const EditCreditsModal = ({ user, token, onClose, onCreditsUpdated }) => {
  const [credits, setCredits] = useState(user.credits);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/credits/reset/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ credits: parseInt(credits, 10) }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update credits");
      }

      const data = await res.json();
      alert(`✅ ${data.message}`);
      onCreditsUpdated(); // refresh parent table
      onClose();
    } catch (err) {
      console.error("Edit credits error:", err.message);
      alert("❌ Could not update credits.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-[400px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-cyan-400 mb-4">
          Edit Credits for {user.username}
        </h2>

        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCreditsModal;
