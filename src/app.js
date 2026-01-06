const express = require("express");

const app = express();


app.use("/", (err,req,res,next)=>{
    if(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})

app.get("/getUserData",(req,res)=>{
    try{
        //logic of DB call and getting user data
        throw new Error("hhddddj");
        res.send("User data sent");
    }
    catch(err){
        res.status(500).send("Error occurred");
    }
})

app.use("/", (err,req,res,next)=>{  // should always be written at the end for best practices
    if(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})


app.listen(3000,()=>{ 
    console.log("Server is running on port 3000");
});   