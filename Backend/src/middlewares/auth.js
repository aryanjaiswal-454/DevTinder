const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const userAuth = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token) return res.status(401).send("Please Login");
        const decodedObject = jwt.verify(token,process.env.JWT_SECRET);
        const {_id}=decodedObject;
        const user = await User.findById(_id);
        if(!user) throw new Error("User not found");
        req.user = user;
        next();
    }
    catch(err){
        res.status(401).send("ERROR : "+err.message);
    }
}
module.exports = {
    userAuth
}