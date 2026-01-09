const mongoose = require("mongoose");
const validator = require("validator");

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
        maxLength : 50,
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

const User = mongoose.model("User",userSchema);
module.exports = User;