// routes/videoRoutes.js
// routes/videoRoutes.js
const express = require("express");
const { authLogin } = require("../middlewares/authMiddleware");
const { downloadYouTubeFormat, downloadTikTokFormat } = require("../controllers/videoController");
const router = express.Router();




router.post("/youtube", authLogin, downloadYouTubeFormat);
router.post("/tiktok", authLogin, downloadTikTokFormat);

module.exports = router;


