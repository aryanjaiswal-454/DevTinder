const express = require("express");

const app = express();

const {adminAuth,userAuth} = require("./middlewares/auth")

// handle auth middleware for all GET, POST, DELETE ...requests
app.use("/admin", adminAuth)

app.post("/user/login",(req,res)=>{
    res.send("Logged in successfully");
})
app.get("/user", userAuth, (req,res)=>{
    res.send("User data sent");
})
app.get("/admin/getAllData",(req,res)=>{
    res.send("All data from admin");
})
app.delete("/admin/deleteUser",(req,res)=>{
    res.send("User deleted");
})





app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});   