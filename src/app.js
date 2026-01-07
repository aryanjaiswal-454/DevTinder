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
