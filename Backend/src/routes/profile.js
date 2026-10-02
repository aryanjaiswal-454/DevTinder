// ## profileRouter
// - GET /profile/view
// - PATCH /profile/edit

const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const { validateProfileEditData } = require("../utils/validation.js");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const safeUser = req.user.toObject();
    delete safeUser.password;
    delete safeUser.googleId;
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

    if (Object.hasOwn(updatedData, "age")) {
      const age = Number(updatedData.age);
      if (!Number.isInteger(age) || age < 15 || age > 100) {
        return res.status(400).send("Age must be a whole number between 15 and 100.");
      }
      updatedData.age = age;
    }
    for (const field of ["firstName", "lastName"]) {
      if (Object.hasOwn(updatedData, field) &&
          (typeof updatedData[field] !== "string" || !updatedData[field].trim())) {
        return res.status(400).send(`${field} is required.`);
      }
    }
    if (Object.hasOwn(updatedData, "about") &&
        (typeof updatedData.about !== "string" || updatedData.about.length > 100)) {
      return res.status(400).send("About must be 100 characters or fewer.");
    }
    if (Object.hasOwn(updatedData, "skills") &&
        (!Array.isArray(updatedData.skills) || updatedData.skills.length > 7)) {
      return res.status(400).send("You can add a maximum of 7 skills.");
    }
    if (Object.hasOwn(updatedData, "photoUrl") &&
        (typeof updatedData.photoUrl !== "string" || !updatedData.photoUrl.trim())) {
      return res.status(400).send("A valid photo URL is required.");
    }

    Object.entries(updatedData).forEach(([field, value]) => {
      loggedInUser.set(field, value);
    });
    await loggedInUser.save();

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
