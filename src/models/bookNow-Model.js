const mongoose = require('mongoose');
const validator = require('validator'); // For email validation

// 1. Model (BookNowRequest Model)
const bookNowRequestSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true, // Remove leading/trailing spaces
        minlength: [4, 'Full Name must be at least 4 characters'],
    },
    phone: {
        type: String,
        required: [true, 'Phone Number is required'],
        //  You might want to add a regex for phone number validation
        //  Example (for a simple numeric phone number):
        // match: [/^\d{10}$/, 'Invalid phone number format'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true, // Store email in lowercase
        validate: [validator.isEmail, 'Invalid email address'], // Use validator
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        minlength: [4, 'Subject must be at least 4 characters'],
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [4, 'Message must be at least 4 characters'],
    },
    status: { // Added status field,  you might use this later to track the request.
        type: String,
        enum: ['pending', 'contacted', 'resolved'], // Possible status values
        default: 'pending', // Default status
    },
}, {
    timestamps: true, // Add createdAt and updatedAt fields
});

const BookNowRequestModel = mongoose.model('BookNowRequest', bookNowRequestSchema, 'bookNowRequests');

module.exports = BookNowRequestModel;
