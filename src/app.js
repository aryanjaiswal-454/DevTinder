const express = require("express");

const connectDB = require("./config/database.js");
const User = require("./models/user.js")

const app = express();

app.use(express.json());

app.post("/signup",async (req,res)=>{
    // const userObj = {
    //     firstName : "Rohit",
    //     lastName : "Sharma",
    //     emailId : "rohit@bcci.com",
    //     password : "worldcup2027",
    //     age : 20,
    //     gender : "male"
    // }
    const userObj = req.body
    try{
        const user = new User(userObj);
        await user.save();
        res.send("User added successfully");
    } catch(err){
        res.status(400).send("Error occurred", err.message)
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

app.patch("/user",async (req,res)=>{
    const userId = req.body.userId;
    const user = req.body;
    try{
        const a = await User.findByIdAndUpdate({_id : userId}, user , {returnDocument : "before"});
        console.log(a);
        res.send("User updataed successfully")
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

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
