// ## userRouter
// - GET /user/requests/recieved
// - GET /user/connections
// - GET /user/feed - gets you  the profile of other users on the platform

const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth.js');
const ConnectionRequest = require('../models/connectionRequest.js');


const USER_SAFE_DATA = "firstName lastName photoUrl about skills";

// - GET /user/requests/recieved
userRouter.get("/user/requests/recieved", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const recievedRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "intrested",
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            "message" : "Recieved connection requests : "+recievedRequests.length,
            recievedRequests,
        })
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})


// - POST /user/connections
userRouter.get("/user/connections",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id},
            ],
            status : "accepted",       
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((row)=>{
            if(row.fromUserId.equals(loggedInUser._id)) return row.toUserId;
            else return row.fromUserId;
        });
        res.json({
            "message" : "Connections : "+connections.length,
            data,
        })
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})



module.exports = userRouter;