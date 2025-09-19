import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import JobCard from "./JobCard";

const MyWorkPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        if (res.data.success) {
          console.log("🔥 Jobs from API:", res.data.jobs);

          // Expand viral jobs into multiple
          const expandedJobs = res.data.jobs.flatMap((job) => {
            if (job.task === "viral" && job.result?.clips?.clips?.length) {
              return job.result.clips.clips.map((clip, idx) => ({
                ...job,
                clip,
                _id: `${job._id}-${idx}`,
              }));
            }
            return job;
          });

          // ✅ Now log safely
          console.log("Expanded jobs:", expandedJobs);

          setJobs(expandedJobs);
        }
      } catch (err) {
        console.error("❌ Failed to fetch jobs", err);
      }
    };
    fetchJobs();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          🚀 My Work
        </h1>
        <Link
          to="/user-dashboard"
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg shadow-md hover:opacity-90 transition"
        >
          ⬅ Back to Dashboard
        </Link>
      </div>

      {/* Jobs Flexbox */}
      <div className="flex flex-wrap justify-center gap-8">
        {jobs.map((job) => (
          <div key={job._id} className="flex-shrink-0">
            <JobCard
              job={job}
              setSelectedJob={setSelectedJob}
              onDelete={(deletedId) =>
                setJobs(jobs.filter((j) => j._id !== deletedId))
              }
            />
          </div>
        ))}
      </div>

      {/* Modal for non-viral jobs */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-[650px] max-h-[85vh] overflow-hidden border border-cyan-500/20 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-cyan-400 capitalize">
              {selectedJob.task} Result
            </h3>

            {/* Content formatter */}
            <div className="bg-black/40 p-4 rounded-xl max-h-[60vh] overflow-y-auto text-sm text-gray-200 font-mono">
              {selectedJob.task === "transcribe" && (
                <pre className="whitespace-pre-wrap break-words">
                  {selectedJob.result?.transcription ||
                    "No transcript available."}
                </pre>
              )}

              {selectedJob.task === "summarize" && (
                <p className="text-gray-100 leading-relaxed">
                  {typeof selectedJob.result?.summary === "string"
                    ? selectedJob.result.summary
                    : selectedJob.result?.summary?.summary ||
                      JSON.stringify(selectedJob.result?.summary) ||
                      "No summary available."}
                </p>
              )}

              {selectedJob.task === "highlights" && (
                <ul className="space-y-2 list-disc pl-5">
                  {selectedJob.result?.highlights?.map((h, i) => (
                    <li key={i}>
                      <span className="text-cyan-400 font-semibold">
                        {h.timestamp || `Highlight ${i + 1}`}:
                      </span>{" "}
                      {h.text || h}
                    </li>
                  )) || <li>No highlights found.</li>}
                </ul>
              )}

              {selectedJob.task === "q&a" && (
                <div>
                  <p className="text-pink-400 font-semibold">Q:</p>
                  <p className="mb-3">{selectedJob.result?.question}</p>
                  <p className="text-green-400 font-semibold">A:</p>
                  <p>{selectedJob.result?.answer}</p>
                </div>
              )}

              {/* Fallback */}
              {!["transcribe", "summarize", "highlights", "q&a"].includes(
                selectedJob.task
              ) && (
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(selectedJob.result, null, 2)}
                </pre>
              )}
            </div>

            {/* Close button */}
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-medium hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWorkPage;
