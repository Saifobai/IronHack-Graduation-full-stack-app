const express = require("express");
const { getCreditsBalance, addCredits, deductCredits, resetCredits } = require("../controllers/creditsControllers");
const { authLogin } = require('../middlewares/authMiddleware'); // ✅ destructure here

const router = express.Router();

router.get("/balance", authLogin, getCreditsBalance);
router.post("/add", authLogin, addCredits);
router.post("/deduct", authLogin, deductCredits);

// Admin only
router.post("/reset/:userId", authLogin, resetCredits);

module.exports = router;
