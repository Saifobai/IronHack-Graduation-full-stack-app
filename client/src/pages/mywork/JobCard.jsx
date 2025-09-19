import { FileText, Star, Sparkles, Mic, Download, Trash2 } from "lucide-react";
import VideoPreview from "./VideoPreview";
import { deleteJobById } from "../../services/jarvisApi";
import { toast } from "react-toastify";

const getIcon = (task) => {
  switch (task) {
    case "transcribe":
      return <Mic className="text-yellow-400" size={22} />;
    case "summarize":
      return <FileText className="text-blue-400" size={22} />;
    case "highlights":
      return <Star className="text-pink-400" size={22} />;
    case "viral":
      return <Sparkles className="text-purple-400" size={22} />;
    default:
      return <FileText className="text-gray-400" size={22} />;
  }
};

// Short preview for non-viral tasks
// Short preview for non-viral tasks
const getPreview = (job) => {
  if (job.task === "summarize" && job.result?.summary) {
    const summary =
      typeof job.result.summary === "string"
        ? job.result.summary
        : job.result.summary.summary; // if nested object
    return summary ? summary.slice(0, 120) + "..." : "No summary found...";
  }

  if (job.task === "transcribe" && job.result?.transcription) {
    const transcript =
      typeof job.result.transcription === "string"
        ? job.result.transcription
        : job.result.transcription.text; // in case it's an object
    return transcript
      ? transcript.slice(0, 120) + "..."
      : "No transcript found...";
  }

  if (job.task === "highlights" && job.result?.highlights) {
    return job.result.highlights
      .slice(0, 3)
      .map((h, i) => `⭐ ${h.text || h}`)
      .join("\n");
  }

  return "No result yet...";
};

const JobCard = ({ job, setSelectedJob, onDelete }) => {
  // Delete job handler
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await deleteJobById(token, job._id);

      toast.success("✅ Job deleted successfully");
      if (onDelete) onDelete(job._id);
    } catch (err) {
      console.error("❌ Delete failed", err);
      toast.error("❌ Failed to delete job");
    }
  };

  return (
    <div
      onClick={() => job.task !== "viral" && setSelectedJob(job)}
      className="cursor-pointer bg-white/5 backdrop-blur-md border border-white/10
             rounded-2xl p-4 shadow-lg hover:shadow-cyan-400/30
             transition-transform hover:-translate-y-1 hover:scale-[1.02]
             w-80 h-[500px] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex justify-between mb-3">
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold capitalize
            ${
              job.task === "viral"
                ? "bg-purple-500/20 text-purple-300"
                : job.task === "transcribe"
                ? "bg-yellow-500/20 text-yellow-300"
                : job.task === "summarize"
                ? "bg-blue-500/20 text-blue-300"
                : "bg-pink-500/20 text-pink-300"
            }`}
        >
          {job.task}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full capitalize
            ${
              job.status === "finished"
                ? "bg-green-500/20 text-green-300"
                : job.status === "processing"
                ? "bg-yellow-500/20 text-yellow-300 animate-pulse"
                : "bg-red-500/20 text-red-300"
            }`}
        >
          {job.status}
        </span>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3 mb-2">
        {getIcon(job.task)}
        <h3 className="font-semibold text-lg capitalize text-gray-100">
          {job.task}
        </h3>
      </div>

      {/* Content (always same space) */}
      <div className="flex-1 w-full overflow-y-auto">
        {job.task === "viral" && job.clip ? (
          <div className="w-full aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-md">
            <VideoPreview clip={job.clip} title={job.clip.title} />
          </div>
        ) : (
          <div className="p-3 w-full h-full overflow-y-auto text-gray-200 text-sm">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {getPreview(job)}
            </pre>
          </div>
        )}
      </div>

      {/* Footer (always visible) */}
      <div className="flex justify-between mt-3">
        {/* Download */}
        {job.task === "viral" && job.clip ? (
          // ✅ Directly download the mp4 for viral clips
          <a
            href={job.clip.url}
            download={`${job.clip.title || "viral_clip"}.mp4`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-pink-500
           rounded-lg text-xs font-medium hover:opacity-90 shadow-md transition"
          >
            <Download size={14} /> Download
          </a>
        ) : (
          // ✅ For other tasks, export JSON result
          <a
            href={
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(job.result, null, 2))
            }
            download={`${job.task}_result.json`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-pink-500
           rounded-lg text-xs font-medium hover:opacity-90 shadow-md transition"
          >
            <Download size={14} /> Download
          </a>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600
         rounded-lg text-xs font-medium text-white shadow-md transition"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
