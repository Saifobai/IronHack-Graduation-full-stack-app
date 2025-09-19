// routes/jobsRoutes.js
const express = require("express");
const { authLogin, requireRole } = require("../middlewares/authMiddleware");
const { getUserJobs, getJobById, getAllJobs, getJobStats, deleteJob } = require("../controllers/jobsController");

const router = express.Router();


//get all jobs admin only
router.get("/all", authLogin, requireRole("admin"), getAllJobs);

// get jobs stats admin only
router.get("/stats", authLogin, requireRole("admin"), getJobStats);

router.get("/", authLogin, getUserJobs);
router.get("/:id", authLogin, getJobById);

router.delete("/delete/:id", authLogin, deleteJob);


module.exports = router;
