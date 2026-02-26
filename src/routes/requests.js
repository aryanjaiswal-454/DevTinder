// Status --- ignore, intrested, accepted, rejected

// ## requestRouter
// - POST /request/send/intrested/:userId
// - POST /request/send/ignored/:userId
// - POST /request/review/accepted/:userId
// - POST /request/review/rejected/:userId

const  express = require('express');
const {userAuth} = require("../middlewares/auth.js");

const requestsRouter = express.Router();

requestsRouter.post("/sendConnectionRequest",userAuth, (req,res)=>{
    try{
        const user = req.user;
        console.log("Connection request sent successfully");
        res.send(user.firstName+" "+user.lastName+" sent you a connection request");
    }
    catch(err) {
        res.status(401).send("ERROR : "+err.message);
    }
})

module.exports = requestsRouter;