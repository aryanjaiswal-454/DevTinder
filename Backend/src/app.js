require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    // "http://localhost:5173",
    "https://devtinder-connectandgrow.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/request.js');
const usertRouter = require('./routes/user.js');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',usertRouter);
// NEVER TRUST req.body BECAUSE IT CAN GET MANY MALICIOUS THINGS IN YOUR DATABASE

connectDB()
    .then(()=>{  
        console.log("Database connected successfully");
        app.listen(PORT,()=>{ 
            console.log(`Server is running on port ${PORT}`);
        }); 
    }) 
    .catch((err)=>{
        console.log("ERROR : Database did not connected");
    })
