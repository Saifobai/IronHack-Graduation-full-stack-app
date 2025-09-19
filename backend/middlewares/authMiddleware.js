const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const authLogin = asyncHandler(async (req, res, next) => {

    let token;

    // Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    // Fallback to cookies
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }


    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = await User.findById(decoded.userId).select('-password');
            next();

        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, Invalid Token');
        }
    }

    else {
        res.status(401);
        throw new Error('Not authorized, No token provided');
    }
});

const requireRole = (...roles) => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized for this action");
    }
};

module.exports = {
    authLogin,
    requireRole,
};
