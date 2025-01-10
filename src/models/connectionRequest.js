const mongoose = require("mongoose");
const User= require("../models/user")

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:User
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:User
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{Value} is incorrect status type`,
      }
    },
  },
  {
    timestamps: true,
  }
);

// creating compound indexing to make query faster
connectionRequestSchema.index({fromUserId: 1, toUserId:1});

connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;
    //check from & to connection id's should not match
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("can't send connection request to yourself..!!!");
    }
    next();
});

const connectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequestModel;
