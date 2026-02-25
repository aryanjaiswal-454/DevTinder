const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName) throw  new Error("Enter your full name");
    else if(!validator.isEmail(emailId)) throw new Error("Invalid EmailID");
    else if(!validator.isStrongPassword(password)) throw new Error("Password is too weak");
}

module.exports={validateSignUpData}; 