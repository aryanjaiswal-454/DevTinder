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
const isGoogleOAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);
const isProduction = process.env.NODE_ENV === "production";

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    expires: new Date(Date.now() + 8 * 3600000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });
};

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const emailId = req.body.emailId.trim().toLowerCase();
    const { password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).send("An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    const token = await user.getJWT();
    setAuthCookie(res, token);

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.googleId;
    return res.status(201).json(safeUser);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send("An account with this email already exists.");
    }
    if (
      err.name === "ValidationError" ||
      err.message?.startsWith("Enter ") ||
      err.message === "Names must be 20 characters or fewer" ||
      err.message === "Invalid EmailID" ||
      err.message === "Password is required" ||
      err.message === "Password is too weak"
    ) {
      return res.status(400).send(err.message);
    }
    console.error("Signup failed:", err);
    return res.status(500).send("Unable to create your account right now.");
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { password } = req.body || {};
    const emailId = typeof req.body?.emailId === "string"
      ? req.body.emailId.toLowerCase().trim()
      : "";

    if (!emailId || !validator.isEmail(emailId)) {
      return res.status(400).send("Please enter a valid email address.");
    }
    if (typeof password !== "string" || !password) {
      return res.status(400).send("Please enter your password.");
    }

    const user = await User.findOne({ emailId });
    
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    if (!user.password && user.googleId) {
      return res.status(401).send(
        "This account is linked with Google. Please click 'Continue with Google' to log in."
      );
    }
    if (!user.password) {
      return res.status(401).send("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      setAuthCookie(res, token);

      const safeUser = user.toObject();
      delete safeUser.password;
      delete safeUser.googleId; 

      res.send(safeUser);
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Login failed:", err);
    return res.status(500).send("Unable to log in right now. Please try again.");
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });
  res.send("Logged out successfully");
});

authRouter.get(
  "/auth/google",
  (req, res, next) => {
    if (!isGoogleOAuthConfigured) {
      return res.status(503).send("Google sign-in is not configured on this server.");
    }
    return passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })(req, res, next);
  },
);

authRouter.get(
  "/auth/google/callback",
  (req, res, next) => {
    if (!isGoogleOAuthConfigured) {
      return res.status(503).send("Google sign-in is not configured on this server.");
    }
    return passport.authenticate("google", {
      failureRedirect: "https://dev-tinder-five-rho.vercel.app/login",
      session: false,
    })(req, res, next);
  },
  async (req, res) => {
    try {
      const user = req.user;
      const token = await user.getJWT();

      setAuthCookie(res, token);

      if (!user.gender || !user.age) {
        return res.redirect("https://dev-tinder-five-rho.vercel.app/profile");
      }
      res.redirect("https://dev-tinder-five-rho.vercel.app/");
    } catch (err) {
      res.redirect(
        "https://dev-tinder-five-rho.vercel.app/login?error=auth_failed",
      );
    }
  },
);

module.exports = authRouter;
