// ## authRouter
// - POST /signup
// - POST /login
// - POST /logout

const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user.js");
const { validateSignUpData } = require("../utils/validation.js");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");
const authRouter = express.Router();

authRouter.post("/send-otp", async (req, res) => {
  try {
    const { emailId } = req.body;

    validateSignUpData(req);

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    await OTP.deleteMany({ email: emailId });

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email: emailId, otp: otp.trim(), expiresAt });

    await sendEmail(emailId, otp);

    res.send("OTP sent successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { emailId, otp, password, firstName, lastName } = req.body;
    validateSignUpData(req);
    const cleanOtp = String(otp).trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      throw new Error("Invalid OTP format");
    }
    const record = await OTP.findOne({ email: emailId }).sort({
      createdAt: -1,
    });
    if (!record || record.otp !== cleanOtp) {
      return res.status(400).send("Invalid OTP");
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).send("OTP expired");
    }

    await OTP.deleteMany({ email: emailId });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.send({
      message: "User registered successfully",
      data: savedUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) throw new Error("Invalid credentials");
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid credentials");
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else throw new Error("Invalid credentials");
  } catch (err) {
    res.status(401).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
});

module.exports = authRouter;
