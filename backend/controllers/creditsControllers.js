const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * @desc   Get user credits balance
 * @route  GET /api/credits/balance
 * @access Private
 */
const getCreditsBalance = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("credits");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.json({ credits: user.credits });
});

/**
 * @desc   Add credits (after subscription/payment)
 * @route  POST /api/credits/add
 * @access Private (Admin or payment webhook)
 */
const addCredits = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error("Invalid amount to add");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.credits += amount;
    await user.save();

    res.json({
        message: `Added ${amount} credits successfully`,
        credits: user.credits,
    });
});

/**
 * @desc   Deduct credits (when user processes video)
 * @route  POST /api/credits/deduct
 * @access Private
 */
const deductCredits = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error("Invalid amount to deduct");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.credits < amount) {
        res.status(402); // Payment required
        throw new Error("Not enough credits. Please subscribe or top-up.");
    }

    user.credits -= amount;
    await user.save();

    res.json({
        message: `Deducted ${amount} credits successfully`,
        credits: user.credits,
    });
});

/**
 * @desc   Reset credits (admin only)
 * @route  POST /api/credits/reset/:userId
 * @access Admin
 */
const resetCredits = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { credits } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.credits = credits || 50; // default reset to 50 if not provided
    await user.save();

    res.json({
        message: `Credits reset successfully for ${user.username}`,
        credits: user.credits,
    });
});

module.exports = {
    getCreditsBalance,
    addCredits,
    deductCredits,
    resetCredits,
};
