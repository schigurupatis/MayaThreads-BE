const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")


//Sending Emails
const sendEmail = require("../utils/sendEmail");


// Sending Connection Request
requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
      try {
        const fromUserId = req.user._id;
        console.log("from user id:", fromUserId)
        const toUserId = req.params.toUserId;
        const status = req.params.status;
  
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
          return res
            .status(400)
            .json({ message: "Invalid status type: " + status });
        }
  
        
        // const toUser = await User.findById(toUserId);
        console.log("toUserId:", toUserId);
        const toUser = await User.findById(toUserId);
        console.log("toUser:", toUser);

        if (!toUser) {
          return res.status(404).json({ message: "User not found!" });
        }
  
        const existingConnectionRequest = await ConnectionRequest.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        });
        if (existingConnectionRequest) {
          return res
            .status(400)
            .send({ message: "Connection Request Already Exists!!" });
        }
  
        const connectionRequest = new ConnectionRequest({
          fromUserId,
          toUserId,
          status,
        });
  
        const data = await connectionRequest.save();
  
        const emailRes = await sendEmail.run(
          "A new friend request from " + req.user.firstName,
          req.user.firstName + " is " + status + " in " + toUser.firstName
        );
        console.log(emailRes);
  
        res.json({
          message:
            req.user.firstName + " is " + status + " in " + toUser.firstName,
          data,
        });
      } catch (err) {
        // res.status(400).send("ERROR: " + err.message);
        res.status(400).json({error: err.message});
      }
    }
  );

  

// Sending Review Request(accept or reject)
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed!"})
        }


        // validate the status
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if(!connectionRequest) {
            return res.status(400).json({ message: "Connection request not found" })
        }
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({ message: "Connection request " + status, data });


        // csk sending connection req to elon
        // loggedInID = toUserID
        // status = interested
        // request Id should be valid



    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestRouter;
