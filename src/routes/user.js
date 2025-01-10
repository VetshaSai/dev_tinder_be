const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");

const USER_SAFE_DATA = ["firstName", "lastName", "skills","aboutUs","photoUrl","age"];
userRouter.get("/user/requests/recived", userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",USER_SAFE_DATA);
        // We can write like this also
        //populate("fromUserId","firstName lastName skills aboutUs photoUrl age ");
        
        const Data = connectionRequest.map(roe => roe.fromUserId);
        console.log(Data);
        res.json({
            message: "Connection requests data retrived",
            data: Data
        });
    }
    catch(err){
        res.status(400).send("Error :"+ err.message);
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId:loggedInUser , status:"accepted"},
                {toUserId:loggedInUser , status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

        const data = connectRequest.map(row => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId});

        res.json({message:"Acceped connection requests data retrived",
            Data:data});

    }catch(err){
        res.status(400).send("Error :"+ err.message);
    }
});

userRouter.get("/user/feed", userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        
        const page = parseInt(req.query.page) || 1;
        //console.log(page);
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        //console.log(limit);
        const skip = (page-1)*limit;
        //console.log(skip);

        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId: loggedInUser._id}]
        }).select('fromUserId toUserId');
        const hideUsersFromFeed = new Set();

        connectionRequests.forEach(data =>{
            hideUsersFromFeed.add(data.fromUserId.toString());
            hideUsersFromFeed.add(data.toUserId.toString());
        });
        
        const users = await User.find({
             $and: [
               { _id: {$nin:Array.from(hideUsersFromFeed)}},
               {_id:  {$ne:loggedInUser._id} }
            ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({data: users});
    }catch(err){
        res.status(400).send("Error :"+ err.message);
    }
})

module.exports = userRouter;