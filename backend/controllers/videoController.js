const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

// Helper: run shell commands
const runCmd = (cmd) =>
    new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) reject(stderr || err.message);
            else resolve(stdout);
        });
    });

// YouTube format (original)
const downloadYouTubeFormat = asyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });

    const id = uuidv4();
    const outputPath = path.join(__dirname, `../uploads/${id}.mp4`);

    try {
        // 🔹 Download original
        await runCmd(`yt-dlp -f mp4 -o "${outputPath}" "${url}"`);

        res.download(outputPath, "youtube_video.mp4", (err) => {
            if (!err && fs.existsSync(outputPath)) fs.unlinkSync(outputPath); // cleanup
        });
    } catch (err) {
        console.error("yt-dlp error:", err);
        res.status(500).json({ error: "Download failed" });
    }
});

// TikTok format (9:16 with black borders)

const downloadTikTokFormat = asyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });

    const id = uuidv4();
    const inputPath = path.join(process.cwd(), `uploads/${id}.mp4`);
    const outputPath = path.join(process.cwd(), `uploads/${id}_tiktok.mp4`);

    try {
        // 1️⃣ Download original video first
        await runCmd(`yt-dlp -f mp4 -o "${inputPath}" "${url}"`);

        // 2️⃣ Convert to TikTok format
        const ffmpegCmd = `ffmpeg -i "${inputPath}" -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" -c:a copy "${outputPath}" -y`;
        await runCmd(ffmpegCmd);

        // 3️⃣ Send converted file
        res.download(outputPath, "tiktok_video.mp4", (err) => {
            // cleanup
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error("TikTok download error:", error);
        res.status(500).json({ error: "Video download/conversion failed" });
    }
});

module.exports = {
    downloadYouTubeFormat,
    downloadTikTokFormat,
};
