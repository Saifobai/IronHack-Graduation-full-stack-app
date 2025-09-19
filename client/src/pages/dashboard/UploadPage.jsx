const UploadPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload a Video</h1>
      <div className="flex w-full max-w-xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <input
          type="text"
          placeholder="Paste a YouTube/TikTok link..."
          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
        />
        <button className="bg-gradient-to-r from-cyan-500 to-pink-500 px-6 py-3 font-semibold hover:opacity-90 transition">
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
