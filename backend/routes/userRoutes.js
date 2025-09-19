
const express = require('express')
const { registerNewUser, loginUser, updateUserProfile, getUserProfile, logoutUser, deleteUser, getAllUsers, forgotPassword, resetPassword, deleteUserByAdmin } = require('../controllers/userControllers')
const { authLogin, requireRole } = require('../middlewares/authMiddleware')

const roleEmailMap = require('../config/roleEmailMap')


const router = express.Router()


// register a new user
router.post('/signup', registerNewUser)

// login a user
router.post('/signin', loginUser)

// update user profile
router.put('/profile', authLogin, updateUserProfile)

// get user profile
router.get('/user-profile', authLogin, getUserProfile)

//logout user
router.get('/logout', logoutUser)

// delete user
router.delete('/delete', authLogin, deleteUser)


// delete user by admin
router.delete('/:id', authLogin, requireRole('admin'), deleteUserByAdmin)


// get all users
router.get('/all-users', authLogin, requireRole('admin'), getAllUsers)

// forgot password
router.post('/forgot-pass', forgotPassword)
router.post('/reset-pass/:token', resetPassword)


module.exports = router