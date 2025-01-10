const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      //console.log(req.user);
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        throw new Error("status not allowed");
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ message: "user not found!" });
      }

      // Check wheather this connect request already exist or not
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("request already exisit");
      }
      const data = await connectionRequest.save();

      res.json({
        message: `${status} sucessfully...!`,
        data: data,
      });
    } catch (err) {
      res.status(401).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:toRequestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toRequestId } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "This status not allowed!!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: toRequestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "connectionRequest user not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: `user ${status} sucessfully` });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
