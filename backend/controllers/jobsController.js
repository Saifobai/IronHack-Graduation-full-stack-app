// controllers/jobsController.js
const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");
const roleEmailMap = require("../config/roleEmailMap");


// get all jobs for the system (admin only)

const getAllJobs = asyncHandler(async (req, res) => {
    let role = "user";
    if (!existingUser) {
        if (roleEmailMap.admin.includes(email)) {
            role = "admin";
        }
    }

    const jobs = await Job.find({})
        .populate("user", "username email")
        .sort({ createdAt: -1 });

    // 🛠 Normalize viral jobs' clips into a flat array
    const normalizedJobs = jobs.map((job) => {
        const j = job.toObject({ flattenMaps: true }); // make sure nested maps are plain

        if (j.task === "viral" && j.result?.clips?.clips) {
            const innerClips = Array.isArray(j.result.clips.clips)
                ? j.result.clips.clips
                : [];

            j.result = {
                ...j.result,
                clips: innerClips, // overwrite with array
            };
        }

        return j;
    });

    res.json({ success: true, jobs: normalizedJobs });


    res.json({ success: true, jobs: normalizedJobs });
});



// get all jobs for current user
const getUserJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
});

// get single job (only owner or admin)
const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate("user", "username email");
    if (!job) return res.status(404).json({ success: false, error: "Job not found" });

    // restrict: owners or admin
    if (String(job.user._id) !== String(req.user._id) && req.user.role !== "admin") {
        return res.status(403).json({ success: false, error: "Not authorized" });
    }

    res.json({ success: true, job });
});


// 📊 Job statistics (admin only)
const getJobStats = asyncHandler(async (req, res) => {
    const totalJobs = await Job.countDocuments({});
    const successJobs = await Job.countDocuments({ status: "finished" });
    const failedJobs = await Job.countDocuments({ status: "failed" });

    // group by task type (summarize, chat, etc.)
    const taskUsage = await Job.aggregate([
        { $group: { _id: "$task", count: { $sum: 1 } } },
    ]);

    res.json({
        success: true,
        stats: {
            totalJobs,
            successJobs,
            failedJobs,
            taskUsage,
        },
    });
});


// delete job (only owner or admin) - BONUS: implement if needed
const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ success: false, error: "Job not found" });
    }

    if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // ✅ Compare directly with job.user since it's an ObjectId, not populated
    if (String(job.user) !== String(req.user._id) && req.user.role !== "admin") {
        return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted successfully" });
});



module.exports = { getUserJobs, getJobById, getAllJobs, getJobStats, deleteJob };
