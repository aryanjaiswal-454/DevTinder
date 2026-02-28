// Status --- ignore, intrested, accepted, rejected

// ## requestRouter
// - POST /request/send/intrested/:userId
// - POST /request/send/ignored/:userId
// - POST /request/review/accepted/:userId
// - POST /request/review/rejected/:userId

const  express = require('express');
const {userAuth} = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
// here error  
const requestRouter = express.Router();
requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","intrested"];
        if(!allowedStatus.includes(status)) throw new Error("Invalid status type");
        
        const isToUserIdValid = await User.findById(toUserId);
        if(!isToUserIdValid) throw new Error("Invalid userId to send connection request");

        // if(fromUserId.toString()===toUserId.toString()) throw new Error("You cannot send connection request to yourself");

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId : toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest) throw new Error("Connection request already exists between these users");

        const connectionRequestObj = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequestObj.save();
        res.json({
            message : "Connection request sent successfully",
            data,
        })
    }
    catch(err) {
        res.status(401).send("ERROR : "+err.message);
    }
})

module.exports = requestRouter;