const VideoSummary = ({ summary }) => {
  if (!summary) return null;

  const text =
    typeof summary === "string"
      ? summary
      : summary?.summary || JSON.stringify(summary);

  return (
    <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-cyan-400 mb-2">
        Video Summary
      </h3>
      <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
    </div>
  );
};

const VideoHighlights = ({ highlights }) => {
  const list = Array.isArray(highlights) ? highlights : [];
  if (list.length === 0) return null;

  return (
    <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-pink-400 mb-2">Highlights</h3>
      <ul className="list-disc list-inside text-gray-300">
        {list.map((h, i) => {
          const text = typeof h === "string" ? h : h?.text || JSON.stringify(h);
          const ts = h?.timestamp ? h.timestamp : `#${i + 1}`;
          return (
            <li key={i}>
              <span className="text-sm text-gray-500">{ts}</span> – {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const VideoTranscription = ({ transcription }) => {
  if (!transcription) return null;

  const text =
    typeof transcription === "string"
      ? transcription
      : transcription?.text || JSON.stringify(transcription);

  return (
    <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-yellow-400 mb-2">
        Transcription
      </h3>
      <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
    </div>
  );
};

const ViralClips = ({ clips }) => {
  const list = Array.isArray(clips) ? clips : [];
  if (list.length === 0) return null;

  return (
    <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-purple-400 mb-2">
        Viral Clips
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {list.map((c, i) => (
          <video
            key={i}
            src={c?.url || ""}
            controls
            className="rounded-lg shadow"
          />
        ))}
      </div>
    </div>
  );
};

export { VideoSummary, VideoHighlights, VideoTranscription, ViralClips };
