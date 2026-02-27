// ## authRouter
// - POST /signup
// - POST /login
// - POST /logout

const express = require('express');
const bcrypt= require("bcrypt");
const validator = require("validator")
const User = require("../models/user.js")
const {validateSignUpData} = require("../utils/validation.js");

const authRouter = express.Router();

authRouter.post("/signup",async (req,res)=>{
    const {firstName, lastName, emailId, password} = req.body
    try{
        // Validation of data
        validateSignUpData(req)

        //  Encrypting Password
        const passwordHash = await bcrypt.hash(password,10);

        
        // Saving user details to the database
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
        });
        await user.save();
        res.send("User added successfully");
    } catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})

authRouter.post("/login",async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)) throw new Error("Invalid credentials");
        const user = await User.findOne({emailId:emailId});
        if(!user) throw new Error("Invalid credentials");
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token",token);
            res.send("Login successfull");
        }
        else throw new Error("Invalid credentials");
    }
    catch(err){
        res.status(401).send("ERROR : "+err.message);
    }
})

authRouter.post("/logout",(req,res)=>{
    res.clearCookie("token");
    res.send("Logged out successfully");
})

module.exports = authRouter;