const bookNowMiddleware = {
    validateRequest: (req, res, next) => {
        //  Moved validation to the model using mongoose, but
        // you can add additional checks here if needed.
        //  Example:  Check for profanity, or other custom rules
        next(); //  Important:  Call next() to continue the request
    },
    logRequest: (req, res, next) => {
        console.log('Book Now Request Received:', req.body);
        next();
    },
    handleError: (err, req, res, next) => {
        console.error("BookNow Error:", err);
        if (err instanceof mongoose.Error.ValidationError) {
             // Format mongoose validation errors
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(400).json({ errors }); // Return 400 for bad request
        }
        //  Handle other types of errors (e.g., database connection errors, etc.)
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// module.exports = {
//     bookNowMiddleware,
// }
module.exports = bookNowMiddleware;