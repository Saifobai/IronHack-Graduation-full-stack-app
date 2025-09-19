// middlewares/requireCredits.js
const User = require("../models/userModel");

const requireCredits = (amount = 1) => {
    return async (req, res, next) => {
        try {
            const userId = req.user && req.user._id;
            if (!userId) return res.status(401).json({ error: "Unauthorized" });

            // atomic decrement only if user has enough credits
            const updated = await User.findOneAndUpdate(
                { _id: userId, credits: { $gte: amount } },
                { $inc: { credits: -amount } },
                { new: true, select: "credits" }
            );

            if (!updated) {
                return res.status(402).json({ error: "Not enough credits. Please subscribe." });
            }

            // attach new balance and amount spent
            req.user.credits = updated.credits;
            req.creditsSpent = amount;

            next();
        } catch (err) {
            console.error("Credits middleware error:", err.message);
            res.status(500).json({ error: "Server error" });
        }
    };
};

module.exports = requireCredits;
