const express = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcrypt")

const { validateSignupData } = require("../utils/validation.js")


const authRouter = express.Router();


// Creating a new instance of the User Model - POST
authRouter.post("/signup", async (req, res) => {
    try {
        //console.log("Received signup data:", req.body);

        // 1. Validation of data 
        validateSignupData(req);

        const { username, phone, email, password } = req.body;

        // 2. Encrypt the Password
        const passwordHash = bcrypt.hashSync(password, 10);
        //console.log(passwordHash)

        // 3. Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email }, { phone }]
        });
        if (existingUser) {
          return res.status(400).json("You have already registered with us. Please login.");
        }

        // 4. Store the user instance in DB
        //const user = new User(req.body)
        const user = new User({
            username, phone, email, password: passwordHash,
        })
        await user.save();  
        res.send("User Added Successfully")
    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
    }



});


// Login API 
// authRouter.post("/login", async (req, res) => {
//     try{
//         const {emailId, password} = req.body;

//         const user = await User.findOne({ emailId});
//         if(!user) {
//             throw new Error("Invalid Credentials")
//         }

//         const isPasswordValid = await user.validatePassword

//         if(isPasswordValid) {
//             // Create a JWT Token
//             const token = await user.getJWT();
//             //console.log("Generated Token:", token);

//             // Add the token to cookie and send the response back to the user
//             // Add the token to cookie
//             res.cookie("token", token, {
//                 httpOnly: true, // Ensures cookie is not accessible via JavaScript
//                 secure: false, // Set to true if using HTTPS
//                 maxAge: 3600000, // Cookie expires in 1 hour (same as token)
//             });

//             res.send(user)
//         } else {
//             throw new Error("Invalid Credentials")
//         }

//     } catch (err) {
//         res.status(400).send("ERR: : " + err);
//     }
// })


authRouter.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });

    if (!user) {
      return res.status(400).json("User not registered withus. Please sign up.");
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json("Incorrect password.");
    }

    // Create JWT token if needed
    const token = await user.getJWT?.(); // If you're using a JWT function

    // Send back user info and token if needed
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set true in production with HTTPS
      maxAge: 3600000,
    });

    // Return the user object (you can select which fields to return)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json("Server error. Please try again later.");
  }
});



// LogOut API
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successfully")
})

module.exports = authRouter;