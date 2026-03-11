const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 1,
        maxLength : 20,
        trim : true,

    },
    lastName : {
        type : String,
        minLength : 1,
        maxLength : 20,
        trim : true,

    },
    emailId : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        index : true,
        trim : true,
        minLength : 1,
        maxLength : 30,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid emailId "+value);
            }
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 5,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is too weak");
            }
        }
    },
    age : {
        type : Number,
        min : 18

    },
    gender : {
        type : String,
        trim : true,
        validate(value){
            if(!["male","female","other"].includes(value)) throw new Error("Invalid gender type");
        }
    },
    photoUrl : {
        type : String,
        trim : true,
        default : "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-No-Background.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Incorrect Photo URL");
            }
        }
    },
    about : {
        type : String,
        trim : true,
        maxLength : 100,
        default : "This is the default about of the user."
    },
    skills : {
        type : [String],
        trim : true,
    },
}, {
    timestamps:true,
})

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEV@Tinder$790", {expiresIn:"7d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputbyUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputbyUser,passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);
module.exports = User;