const express = require("express");
const app = express();

const connectDB = require("./config/database.js");

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
