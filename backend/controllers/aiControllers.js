// // ===============================================================
// // controllers/aiControllers.js
// // Refactored version with job queueing
// // ===============================================================

// const asyncHandler = require("express-async-handler");
// const { callPythonAPI } = require("../utils/callPythonAPI");
// const Job = require("../models/jobModel");
// const requireCredits = require("../utils/credits");

// // ================= Helper functions =================
// const createJob = async (userId, task, payload = {}) => {
//     return await Job.create({
//         user: userId,
//         task,
//         payload,
//         status: "processing",
//     });
// };

// const finalizeJob = async (job, result) => {
//     job.result = result;
//     job.status = "finished";
//     await job.save();
// };

// const failJob = async (job, errorMessage) => {
//     job.result = { error: errorMessage };
//     job.status = "failed";
//     await job.save();
// };

// // ================= Controllers =======================

// // Summarize
// const summarizeVideo = asyncHandler(async (req, res) => {
//     const { videoUrl } = req.body;
//     if (!videoUrl)
//         return res.status(400).json({ success: false, error: "Video URL required" });

//     const job = await createJob(req.user._id, "summarize", { url: videoUrl });

//     try {
//         const result = await callPythonAPI("/summarize", { url: videoUrl });
//         await finalizeJob(job, result);

//         res.json({
//             success: true,
//             task: "summarize",
//             result,
//             creditsLeft: req.user.credits,
//             jobId: job._id,
//         });
//     } catch (err) {
//         await failJob(job, err.message);
//         if (req.creditsSpent)
//             await requireCredits(req.user._id, req.creditsSpent);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // Highlights
// const generateHighlights = asyncHandler(async (req, res) => {
//     const { videoUrl } = req.body;
//     if (!videoUrl)
//         return res.status(400).json({ success: false, error: "Video URL required" });

//     const job = await createJob(req.user._id, "highlights", { url: videoUrl });

//     try {
//         const result = await callPythonAPI("/highlights", { url: videoUrl });
//         await finalizeJob(job, result);

//         res.json({
//             success: true,
//             task: "highlights",
//             result,
//             creditsLeft: req.user.credits,
//             jobId: job._id,
//         });
//     } catch (err) {
//         await failJob(job, err.message);
//         if (req.creditsSpent)
//             await requireCredits(req.user._id, req.creditsSpent);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // Transcribe
// const transcribeVideo = asyncHandler(async (req, res) => {
//     const { videoUrl } = req.body;
//     if (!videoUrl)
//         return res.status(400).json({ success: false, error: "Video URL required" });

//     const job = await createJob(req.user._id, "transcribe", { url: videoUrl });

//     try {
//         const result = await callPythonAPI("/transcribe", { url: videoUrl });
//         await finalizeJob(job, result);

//         res.json({
//             success: true,
//             task: "transcribe",
//             result,
//             creditsLeft: req.user.credits,
//             jobId: job._id,
//         });
//     } catch (err) {
//         await failJob(job, err.message);
//         if (req.creditsSpent)
//             await requireCredits(req.user._id, req.creditsSpent);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // Chat Q&A
// const chatWithAgent = asyncHandler(async (req, res) => {
//     const { message, video_id, videoUrl } = req.body;

//     if (!message && !videoUrl) {
//         return res.status(400).json({
//             success: false,
//             error: "Either a message or a videoUrl is required",
//         });
//     }

//     const job = await createJob(req.user._id, "chat", { video_id, videoUrl, message });

//     try {
//         // Always send `url` to Python (for consistency)
//         const payload = { message };
//         if (videoUrl) payload.url = videoUrl;
//         if (video_id) payload.video_id = video_id;

//         const result = await callPythonAPI("/chat", payload);
//         await finalizeJob(job, result);

//         res.json({
//             success: true,
//             task: "chat",
//             result,
//             creditsLeft: req.user.credits,
//             jobId: job._id,
//         });
//     } catch (err) {
//         await failJob(job, err.message);
//         if (req.creditsSpent)
//             await requireCredits(req.user._id, req.creditsSpent);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // Viral Clips
// const generateViralClips = asyncHandler(async (req, res) => {
//     const { videoUrl } = req.body;
//     if (!videoUrl)
//         return res.status(400).json({ success: false, error: "Video URL required" });

//     const job = await createJob(req.user._id, "viral", { url: videoUrl });

//     try {
//         const result = await callPythonAPI("/viral", { url: videoUrl });
//         await finalizeJob(job, result);

//         res.json({
//             success: true,
//             task: "viral",
//             result,
//             creditsLeft: req.user.credits,
//             jobId: job._id,
//         });
//     } catch (err) {
//         await failJob(job, err.message);
//         if (req.creditsSpent)
//             await requireCredits(req.user._id, req.creditsSpent);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // Export all controllers
// module.exports = {
//     summarizeVideo,
//     generateHighlights,
//     transcribeVideo,
//     generateViralClips,
//     chatWithAgent,
// };




// ===============================================================
// controllers/aiControllers.js
// Refactored version with job queueing + UUID job IDs
// ===============================================================

const asyncHandler = require("express-async-handler");
const { callPythonAPI } = require("../utils/callPythonAPI");
const Job = require("../models/jobModel");
const requireCredits = require("../utils/credits");
const { v4: uuidv4 } = require("uuid");

// ================= Helper functions =================
const createJob = async (userId, task, payload = {}) => {
    return await Job.create({
        user: userId,
        task,
        payload,
        status: "processing",
    });
};

// const finalizeJob = async (job, result) => {
//     job.result = result;
//     job.status = "finished";
//     await job.save();
// };



const finalizeJob = async (job, result) => {
    try {
        job.result = result;   // ✅ always normalized now
        job.status = "finished";
        await job.save();
    } catch (err) {
        console.error("❌ finalizeJob failed", err);
        job.status = "failed";
        job.result = { error: err.message };
        await job.save();
    }
};







const failJob = async (job, errorMessage) => {
    job.result = { error: errorMessage };
    job.status = "failed";
    await job.save();
};

// ================= Controllers =======================

// Summarize
const summarizeVideo = asyncHandler(async (req, res) => {
    const { videoUrl } = req.body;
    if (!videoUrl)
        return res.status(400).json({ success: false, error: "Video URL required" });

    const jobId = uuidv4();
    const job = await createJob(req.user._id, "summarize", { url: videoUrl, jobId });

    try {
        const result = await callPythonAPI("/summarize", { url: videoUrl, jobId });
        await finalizeJob(job, result);

        res.json({
            success: true,
            task: "summarize",
            result,
            creditsLeft: req.user.credits,
            jobId: job._id,
        });
    } catch (err) {
        await failJob(job, err.message);
        if (req.creditsSpent)
            await requireCredits(req.user._id, req.creditsSpent);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Highlights
const generateHighlights = asyncHandler(async (req, res) => {
    const { videoUrl } = req.body;
    if (!videoUrl)
        return res.status(400).json({ success: false, error: "Video URL required" });

    const jobId = uuidv4();
    const job = await createJob(req.user._id, "highlights", { url: videoUrl, jobId });

    try {
        const result = await callPythonAPI("/highlights", { url: videoUrl, jobId });
        await finalizeJob(job, result);

        res.json({
            success: true,
            task: "highlights",
            result,
            creditsLeft: req.user.credits,
            jobId: job._id,
        });
    } catch (err) {
        await failJob(job, err.message);
        if (req.creditsSpent)
            await requireCredits(req.user._id, req.creditsSpent);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Transcribe
const transcribeVideo = asyncHandler(async (req, res) => {
    const { videoUrl } = req.body;
    if (!videoUrl)
        return res.status(400).json({ success: false, error: "Video URL required" });

    const jobId = uuidv4();
    const job = await createJob(req.user._id, "transcribe", { url: videoUrl, jobId });

    try {
        const result = await callPythonAPI("/transcribe", { url: videoUrl, jobId });
        await finalizeJob(job, result);

        res.json({
            success: true,
            task: "transcribe",
            result,
            creditsLeft: req.user.credits,
            jobId: job._id,
        });
    } catch (err) {
        await failJob(job, err.message);
        if (req.creditsSpent)
            await requireCredits(req.user._id, req.creditsSpent);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Chat Q&A
const chatWithAgent = asyncHandler(async (req, res) => {
    const { message, video_id, videoUrl } = req.body;

    if (!message && !videoUrl) {
        return res.status(400).json({
            success: false,
            error: "Either a message or a videoUrl is required",
        });
    }

    const jobId = uuidv4();
    const job = await createJob(req.user._id, "chat", { video_id, videoUrl, message, jobId });

    try {
        const payload = { message, jobId };
        if (videoUrl) payload.url = videoUrl;
        if (video_id) payload.video_id = video_id;

        const result = await callPythonAPI("/chat", payload);
        await finalizeJob(job, result);

        res.json({
            success: true,
            task: "chat",
            result,
            creditsLeft: req.user.credits,
            jobId: job._id,
        });
    } catch (err) {
        await failJob(job, err.message);
        if (req.creditsSpent)
            await requireCredits(req.user._id, req.creditsSpent);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Viral Clips
const generateViralClips = asyncHandler(async (req, res) => {
    const { videoUrl } = req.body;
    if (!videoUrl)
        return res.status(400).json({ success: false, error: "Video URL required" });

    const jobId = uuidv4();
    const job = await createJob(req.user._id, "viral", { url: videoUrl, jobId });

    try {
        const result = await callPythonAPI("/viral", { url: videoUrl, jobId });

        // Instead of saving one job with clips, save multiple jobs
        if (result.clips && Array.isArray(result.clips)) {
            await Promise.all(
                result.clips.map((clip, idx) =>
                    Job.create({
                        user: req.user._id,
                        task: "viral",
                        payload: { url: videoUrl, jobId: `${jobId}-${idx}` },
                        result: { clip },
                        status: "finished",
                    })
                )
            );

            // delete placeholder parent job
            await job.deleteOne();
        } else {
            await finalizeJob(job, result);
        }

        res.json({
            success: true,
            task: "viral",
            result,
            creditsLeft: req.user.credits,
        });
    } catch (err) {
        await failJob(job, err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});


// Export all controllers
module.exports = {
    summarizeVideo,
    generateHighlights,
    transcribeVideo,
    generateViralClips,
    chatWithAgent,
};
