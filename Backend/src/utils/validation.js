const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body || {};
  if (typeof firstName !== "string" || !firstName.trim() ||
      typeof lastName !== "string" || !lastName.trim()) {
    throw new Error("Enter your full name");
  } else if (firstName.trim().length > 20 || lastName.trim().length > 20) {
    throw new Error("Names must be 20 characters or fewer");
  } else if (typeof emailId !== "string" || !validator.isEmail(emailId.trim())) {
    throw new Error("Invalid EmailID");
  } else if (typeof password !== "string" || !password) {
    throw new Error("Password is required");
  }
  else if (!validator.isStrongPassword(password))
    throw new Error("Password is too weak");
};
const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );
  return isEditAllowed;
};
module.exports = { validateSignUpData, validateProfileEditData };
