const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const validator = require("validator")
const bcrypt = require("bcrypt")

// Schema for User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 4,
    },
    phone: {
        type: String,
        required: true,
        minLength: 10,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }
})


userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
                    expiresIn: "7d", // Token expires in 1 hour
                });

                return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;

    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    )
    return isPasswordValid;
}

// Model for User
module.exports = mongoose.model("User", userSchema);

