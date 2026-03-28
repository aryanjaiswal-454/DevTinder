const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: 20,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      trim: true,
      minLength: 1,
      maxLength: 50,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid emailId " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is too weak");
        }
      },
      select: false,
    },
    age: {
      type: Number,
      min: 15,
      max: 100,
      default: undefined ,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value))
          throw new Error("Invalid gender type");
      },
    },
    photoUrl: {
      type: String,
      trim: true,
      default:
        "https://imgs.search.brave.com/Ix1-GRkxAk-RaWwN4ipJrGWovxPjIOpdZ-zGHKDlpyY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzgv/MjkxLzI0NC9zbWFs/bC9mbGF0LXNpbGhv/dWV0dGUtdXNlci1o/ZWFkLWFuZC1zaG91/bGRlcnMtYXZhdGFy/LWdyYXBoaWMtaWNv/bi12ZWN0b3IuanBn",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Incorrect Photo URL");
        }
      },
    },
    about: {
      type: String,
      trim: true,
      maxLength: 100,
      default: "This is the default about of the user.",
    },
    skills: {
      type: [String],
      validate: [
        {
          validator: function (arr) {
            return arr.length <= 7; 
          },
          message: "You can add maximum 7 skills only",
        },
        {
          validator: function (arr) {
            return arr.every(
              (skill) =>
                typeof skill === "string" &&
                skill.trim().length > 0 &&
                skill.length <= 20,
            );
          },
          message: "Each skill must be non-empty and <= 20 characters",
        },
      ],
      set: (skills) => skills.map((skill) => skill.trim().toLowerCase()), 
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputbyUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputbyUser,
    passwordHash,
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
