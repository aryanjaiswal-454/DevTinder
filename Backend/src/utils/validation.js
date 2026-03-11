const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName) throw  new Error("Enter your full name");
    else if(!validator.isEmail(emailId)) throw new Error("Invalid EmailID");
    else if(!validator.isStrongPassword(password)) throw new Error("Password is too weak");
}
const validateProfileEditData = (req)=>{
    const allowedEditFields = ["firstname","lastName","age","photoUrl","emailId","gender","about","skills"];
    const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));
    return isEditAllowed; 
}
module.exports={validateSignUpData, validateProfileEditData}; 