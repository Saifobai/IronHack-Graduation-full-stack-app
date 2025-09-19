// routes/aiRoutes.js
const express = require("express");
const requireCredits = require("../middlewares/requireCredits");
const {
    summarizeVideo,
    generateHighlights,
    transcribeVideo,
    generateViralClips, // <- don’t forget this
    chatWithAgent,
} = require("../controllers/aiControllers");
const { authLogin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/summarize", authLogin, requireCredits(5), summarizeVideo);
router.post("/highlights", authLogin, requireCredits(7), generateHighlights);
router.post("/viral", authLogin, requireCredits(8), generateViralClips);
router.post("/transcribe", authLogin, requireCredits(10), transcribeVideo);
router.post("/chat", authLogin, requireCredits(1), chatWithAgent);

module.exports = router;
