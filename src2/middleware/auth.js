const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        // Read the token from the req cookies

        //const { token } = req.cookies;
        const token = req.cookies["token"]; // Ensure cookie name matches
        console.log("backend token is:", token);

        if(!token) {
            //throw new Error("Token is not valid")
            return res.status(401).send("Please Login");
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        
        const { _id } = decodedObj;

        const user = await User.findById(_id);

        if(!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    }
    // catch (err) {
    //     res.status(400).send("ERROR: " + err.message);
    // }
    catch (err) {
        console.error("JWT Verification Error:", err);
        res.status(400).send("ERROR: " + err.message);
    }

    // Validate the token

    // Find the user
}

module.exports = {
    userAuth,
}

