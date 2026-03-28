// ## profileRouter
// - GET /profile/view
// - PATCH /profile/edit
// - PATCH /profile/password

const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const { validateProfileEditData } = require("../utils/validation.js");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const safeUser = req.user.toObject();
    delete safeUser.password;
    res.send(safeUser);
  } catch (err) {
    res.status(401).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) throw new Error("Invalid Edit Request");

    const loggedInUser = req.user;
    const updatedData = req.body;

    Object.keys(updatedData).forEach((field) => {
      loggedInUser.set(field, updatedData[field]);
    });

    const safeUser = loggedInUser.toObject();
    delete safeUser.password;

    res.json({
      message: `${loggedInUser.firstName}, your profile is updated successfully`,
      data: safeUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
