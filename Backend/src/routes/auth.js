// ## authRouter
// - POST /signup
// - POST /login
// - POST /logout

const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user.js");
const { validateSignUpData } = require("../utils/validation.js");
const authRouter = express.Router();
const passport = require("passport");


authRouter.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const emailId = req.body.emailId?.toLowerCase().trim();
    if (!validator.isEmail(emailId)) throw new Error("Invalid credentials");
    const user = await User.findOne({ emailId }).select("+password");
    if (!user) throw new Error("Invalid credentials");
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
      });
      const safeUser = user.toObject();
      delete safeUser.password;
      res.send(safeUser);
    } else throw new Error("Invalid credentials");
  } catch (err) {
    res.status(401).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.send("Logged out successfully");
});

authRouter.get("/auth/google", passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account" 
}));

authRouter.get("/auth/google/callback", 
  passport.authenticate("google", { 
    failureRedirect: "https://devtinder-connectandgrow.netlify.app/login", 
    session: false 
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: true,      
        sameSite: "None", 
        path: "/",
      });

      if (!user.gender || !user.age) {
        return res.redirect("https://devtinder-connectandgrow.netlify.app/profile"); 
      }

      res.redirect("https://devtinder-connectandgrow.netlify.app/"); 
    } catch (err) {
      res.redirect("https://devtinder-connectandgrow.netlify.app/login?error=auth_failed"); 
    }
  }
);

module.exports = authRouter;