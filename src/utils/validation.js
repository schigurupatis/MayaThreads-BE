const validator = require("validator");


const validateSignupData = (req) => {

    const {username, phone, email, password} = req.body;

    if(!username) {
        throw new Error("Name is not valid!");
    }
    else if(!phone) {
        throw new Error("Phone is not valid!");
    }
    else if(!validator.isEmail(email)) {
        throw new Error("Email is not valid!");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not valid!");
    }
}


const validateProfileEditData = (req) => {

    const allowedEditFields = ["username", "phone", "email"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;

}


const validateBookNow = (req) => {

    const {fullname, phone, email, subject, message} = req.body;

    if(!fullname) {
        throw new Error("Full Name is not valid!");
    }
    else if(!phone) {
        throw new Error("Phone is not valid!");
    }
    else if(!validator.isEmail(email)) {
        throw new Error("Email is not valid!");
    }
    else if(!subject) {
        throw new Error("Subject is not valid!");
    }
    else if(!message) {
        throw new Error("Message is not valid!");
    }
}

module.exports = {
    validateSignupData,
    validateProfileEditData,
    validateBookNow,
}