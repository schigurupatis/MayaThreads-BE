const BookNowRequestModel = require("../models/bookNow-Model.js");
const express = require('express');
const bookNowRouter = express.Router();
const { validateRequest, logRequest, handleError } = require('../middleware/bookNow-Middleware.js'); // Import middleware
const { validateBookNow } = require('../utils/validation.js');

//  Use async/await for cleaner code
bookNowRouter.post('/booknow', logRequest, validateRequest, async (req, res) => {
    try {
        validateBookNow(req);

        const { fullname, phone, email, subject, message } = req.body;

        const BookNowRequest = new BookNowRequestModel({
            fullname, phone, email, subject, message
        });
        await BookNowRequest.save();  

        //const savedRequest = await newRequest.save(); // Save the new request

        //  Send a 201 Created status on successful creation
        // res.status(201).json({ message: 'Request submitted successfully', data: savedRequest });
        res.send("Request submitted successfully")
    } catch (error) {
        //  Use the error handling middleware
        // handleError(error, req, res, next);
        res.status(400).send("Error saving the user:" + error.message);

    }
});

//  Optional:  Get all requests (for admin)
bookNowRouter.get('/', async (req, res, next) => {
    try {
        const requests = await BookNowRequestModel.find();
        res.json(requests);
    } catch (error) {
        handleError(error, req, res, next);
    }
});

// Optional: Get single request
bookNowRouter.get('/:id', async (req, res, next) => {
  try {
      const request = await BookNowRequestModel.findById(req.params.id);
      if (!request) {
          return res.status(404).json({ error: 'Request not found' });
      }
      res.json(request);
  } catch (error) {
      handleError(error, req, res, next);
  }
});

//  Optional: Update Request Status (for admin)
bookNowRouter.patch('/:id', async (req, res, next) => {
    try {
        const updatedRequest = await BookNowRequestModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status }, //  Only allow updating the status
            { new: true, runValidators: true } //  Return the updated object, and validate the update
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json(updatedRequest);
    } catch (error) {
        handleError(error, req, res, next);
    }
});

//  Optional: Delete a request
bookNowRouter.delete('/:id', async (req, res) => {
  try {
      const deletedRequest = await BookNowRequestModel.findByIdAndDelete(req.params.id);
      if (!deletedRequest) {
          return res.status(404).json({ error: 'Request not found' });
      }
      res.json({ message: 'Request deleted successfully' });
  } catch (error) {
      handleError(error, req, res, next);
  }
});



module.exports = bookNowRouter;