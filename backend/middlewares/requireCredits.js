// backend/middleware/requireCredits.js
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * requireCredits(required = 1)
 * Ensures user has enough credits, atomically deducts them, or returns 402.
 */
const requireCredits = (required = 1) =>
    asyncHandler(async (req, res, next) => {
        const userId = req.user && req.user._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // Atomic decrement if enough credits
        const updated = await User.findOneAndUpdate(
            { _id: userId, credits: { $gte: required } },
            { $inc: { credits: -required } },
            { new: true, select: "credits" }
        );

        if (!updated) {
            return res.status(402).json({
                message: "Not enough credits. Please subscribe or top-up.",
            });
        }

        req.user.credits = updated.credits;
        req.creditsSpent = required; // allow refund on failure
        next();
    });

module.exports = requireCredits;
