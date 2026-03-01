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
const requestRouter = express.Router();

// - POST /request/send/intrested/:userId
// - POST /request/send/ignored/:userId
requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","intrested"];
        if(!allowedStatus.includes(status))
            return res.status(400).json({"ERROR" : "Invalid status type"});
        
        const isToUserIdValid = await User.findById(toUserId);
        if(!isToUserIdValid)
            return res.status(400).json({"ERROR" : "Invalid userId to send connection request"});

        if(fromUserId.toString()===toUserId.toString()) 
            return res.status(400).json({"ERROR" : "You cannot send connection request to yourself"});

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId : toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest) 
            return res.status(400).json({"ERROR" : "Connection request already exists between these users"});

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


// - POST /request/review/accepted/:userId
// - POST /request/review/rejected/:userId
requestRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const requestId = req.params.requestId;
        const status = req.params.status;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status))
            return res.status(400).json({"ERROR" : "Invalid status type"});

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "intrested",
        });
        if(!connectionRequest)
            return res.status(400).json({"ERROR" : "Invalid connection request"});

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json(
            {
                "message" : "Connection request "+status,
                data,
            }
        )
    }
    catch(err) {
        res.status(401).send("ERROR : "+err.message);
    }
})

module.exports = requestRouter;