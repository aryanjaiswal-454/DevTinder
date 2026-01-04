const express = require("express");

const app = express();

app.get("/user",(req,res)=>{
    res.send({"name":"Aryan", "age":21});
})
app.put("/user",(req,res)=>{
    res.send("User data saved successfully")
})
app.delete("/user",(req,res)=>{
    res.send("Deleted successfully")
})
app.use("/test",(req,res)=>{
    res.send("Hello from express server");
})



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
}); 