// ## userRouter
// - GET /user/requests/received
// - GET /user/connections
// - GET /user/feed - gets you  the profile of other users on the platform

const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

const USER_SAFE_DATA = "firstName lastName photoUrl about skills age gender";

// - GET /user/requests/received
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Received connection requests : " + receivedRequests.length,
      receivedRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// - GET /user/connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString())
        return row.toUserId;
      else return row.fromUserId;
    });
    res.json({
      message: "Connections : " + connections.length,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// - GET /user/feed - gets you  the profile of other users on the platform
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit < 0) limit = 10;
    if (limit > 50) limit = 50;
    let skip = (page - 1) * limit;
    if (skip < 0) skip = 0;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = [
      ...connectionRequests.flatMap((req) => [
        req.fromUserId.toString(),
        req.toUserId.toString(),
      ]),
      loggedInUser._id.toString(),
    ];

    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
