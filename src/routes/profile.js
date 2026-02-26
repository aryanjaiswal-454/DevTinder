// ## profileRouter
// - GET /profile/view
// - PATCH /profile/edit
// - PATCH /profile/password

const express = require('express');
const {userAuth} = require("../middlewares/auth.js");

const profileRouter = express.Router();

profileRouter.get("/profile",userAuth, async (req,res)=>{
    try{
        res.send(req.user);
    }
    catch(err){
        res.status(401).send("ERROR : "+err.message);
    }
})

module.exports = profileRouter;