const express = require("express");
const bcrypt= require("bcrypt");
const validator = require("validator")

const connectDB = require("./config/database.js");
const User = require("./models/user.js")
const {validateSignUpData} = require("./utils/validation.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup",async (req,res)=>{
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
app.post("/login",async (req,res)=>{
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
app.get("/profile",userAuth, async (req,res)=>{
    try{
        res.send(req.user);
    }
    catch(err){
        res.status(401).send("ERROR : "+err.message);
    }
})
app.post("/sendConnectionRequest",userAuth, (req,res)=>{
    try{
        const user = req.user;
        console.log("Connection request sent successfully");
        res.send(user.firstName+" "+user.lastName+" sent you a connection request");
    }
    catch(err) {
        res.status(401).send("ERROR : "+err.message);
    }
})


// NEVER TRUST req.body BECAUSE IT CAN GET MANY MALICIOUS THINGS IN YOUR DATABASE

connectDB()
    .then(()=>{  
        console.log("Database connected successfully");
        app.listen(3000,()=>{ 
            console.log("Server is running on port 3000");
        }); 
    }) 
    .catch((err)=>{
        console.log("ERROR : Database did not connected");
    })
