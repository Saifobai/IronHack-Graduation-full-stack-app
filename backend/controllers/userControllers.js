
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')
const roleEmailMap = require('../config/roleEmailMap')
const nodemailer = require("nodemailer")
const crypto = require("crypto")





// register a new user
const registerNewUser = asyncHandler(async (req, res) => {

    const { username, email, password, photo } = req.body

    // validation
    if (!username || !email || !password) {
        res.status(404);
        throw new Error('Please provide all the required fields');
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(404);
        throw new Error(`${username} already exists`);
    }

    let role = "user"
    if (!existingUser) {

        if (roleEmailMap.admin.includes(email)) {
            role = "admin"
        }
    }

    // create a new user 
    const user = await User.create({
        username,
        email,
        password,
        photo,
        role
    })

    if (user) {
        const token = generateToken(res, user._id);
        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                photo: user.photo,
                role: user.role,
                credits: user.credits
            }
        })
    } else {
        res.status(500);
        throw new Error("Failed to register user");
    }
})



// login user 
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    // validation
    if (!email || !password) {
        res.status(404);
        throw new Error('Please provide all the required fields');
    }

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(res, user._id)
        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                photo: user.photo,
                role: user.role,
                credits: user.credits
            }
        })
    }
    else {
        res.status(401)
        throw new Error('Wrong user Credentials')
    }


})



// update user profile
const updateUserProfile = asyncHandler(async (req, res) => {

    const { username, email, photo } = req.body

    const userId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // ✅ Update only the provided fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (photo) user.photo = photo;
    // if (password) user.password = password; // not required in this case as password is not hashed and stored in db

    // Save updated user
    const updatedUser = await user.save()

    res.json({
        success: true,
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        photo: updatedUser.photo
    })
})






// get user profile
const getUserProfile = asyncHandler(async (req, res) => {


    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(201).json({
        success: true,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            photo: user.photo,
            role: user.role,
            credits: user.credits
        }
    })
})


// logout user
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        expires: new Date(0) // ✅ Immediately expire the cookie
    });
    res.status(200).json({ message: 'User logged out successfully' });
});



// delete user
const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndDelete(req.user._id)

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        success: true,
        message: 'User deleted successfully'
    })
})



// delete user (admin only)
const deleteUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne();

    res.json({
        success: true,
        message: "User deleted successfully",
    });
});


// get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password"); // ✅ exclude password

    res.json({
        success: true,
        count: users.length,
        users,
    });
});




// forgot password
const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body
    if (!email) {
        res.status(400);
        throw new Error("Please provide your email");
    }

    // find user by email
    const user = await User.findOne({ email })
    if (!user) {
        res.status(404);
        throw new Error("No user found with that email");
    }

    // reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest('hex')

    // set token and expiry on user
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000
    await user.save()

    const resetUrl = `http://localhost:5173/reset-pass/${resetToken}`

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: `"YourApp"<${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset",
        html: `<p>Hello ${user.username},</p>
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link expires in 1 hour.</p>`
    }

    try {
        await transporter.sendMail(mailOptions)
        res.status(200).json({ msg: 'Reset link sent to email' });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to send reset email. Please try again later.' });
    }


})


// reset password
const resetPassword = asyncHandler(async (req, res) => {

    const { token } = req.params;
    const { password } = req.body

    if (!password) {
        res.status(400);
        throw new Error("Please provide a new password");
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.password = password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save()

    res.status(200).json({ msg: 'Password has been reset successfully' });
})



module.exports = {
    registerNewUser,
    loginUser,
    updateUserProfile,
    getUserProfile,
    deleteUser,
    logoutUser,
    getAllUsers,
    forgotPassword,
    resetPassword,
    deleteUserByAdmin
}