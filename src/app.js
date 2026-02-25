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
app.get("/profile",userAuth, async (req,res)=>{
    try{
        res.send(req.user);
    }
    catch(err){
        res.status(401).send("ERROR : "+err.message);
    }
})
app.get("/user", async (req,res)=>{
    const userEmailId = req.body.emailId;

    try{
        const user = await User.findOne({emailId:userEmailId});  // a single object that created first (oldest)
        if(!user) res.status(404).send("User not found")
        else res.send(user);
    } catch(err){
        res.status(400).send("Something went wrong");
    }


    // try{
    //     const users = await  User.find({emailId:userEmailId});   // array of objects
    //     if(users.length===0) res.status(404).send("User not found");
    //     else res.send(users);
    // } catch(err){
    //     res.status(400).send("Something went wrong");
    // }

})
app.get("/feed", async (req,res)=>{
    try{
        const users = await  User.find({});
        if(users.length===0) res.status(404).send("User not found");
        else res.send(users);
    } catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.delete("/user", async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user) res.send("User doesn't exist")
        else res.send("User deleted successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;

    
    try{
        const ALLOWED_UPDATES = ["age","gender","about","photoUrl","skills"]
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        )
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("Too much skills...MAX LENGTH is 10")
        }
        const a = await User.findByIdAndUpdate({_id : userId}, data , {
            returnDocument : "before", 
            runValidators : true
        } );
        console.log(a);
        res.send("User updataed successfully")
    }
    catch(err){
        res.status(401).send(err.message);
    }
})

app.post("/login",async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)) throw new Error("Invalid credentials");
        const user = await User.findOne({emailId:emailId});
        if(!user) throw new Error("Invalid credentials");
        const userPassword = user.password;
        const isPasswordValid = await bcrypt.compare(password,userPassword);
        if(isPasswordValid){
            const token = jwt.sign({_id:user._id},"DEV@Tinder$790");
            res.cookie("token",token);
            res.send("Login successfull");
        }
        else throw new Error("Invalid credentials");
    }
    catch(err){
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
