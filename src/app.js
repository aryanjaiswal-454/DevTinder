const express = require("express");

const app = express();

app.get(
    "/user",
    [(req,res,next)=>{
        console.log("1st response sended");
        // res.send("Route Handler 1");
        next();  // This will give error because response is already sent but not in the last one because in last one it's acceptable
    },
    (req,res,next)=>{
        console.log("2nd response sended");
        // res.send("Route Handler 2");
        next();
    }],
    [(req,res,next)=>{
        console.log("3rd response sended");
        res.send("Route Handler 3");
        next();

    }],
    (req,res,next)=>{
        console.log("4th response sended");
        // res.send("Route Handler 4"); 
        next();  // This will not give error even after sending response because it's the last middleware
    }
)

// Middleware -  function that has access to req, res and next objects


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});   