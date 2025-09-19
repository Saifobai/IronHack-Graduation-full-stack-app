
const mongoose = require('mongoose')

const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({

    username: {
        type: String,
        require: [true, "Please add a Username"]
    },
    email: {
        type: String,
        required: [true, "Please add an Email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid Email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters"],
    },
    photo: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    credits: {
        type: Number,
        default: 50,  // ✅ every new user starts with 50 credits
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, { timestamps: true })


userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User