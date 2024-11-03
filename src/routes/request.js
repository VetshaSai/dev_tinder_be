const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.get ("/sendConnectionRequest",userAuth, async(req,res)=>{
    try{
      const user = req.user;
      const {firstName} = user;
      res.send(firstName+" connection request sent !!!");
    } catch(err){
      res.status(401).send("Error: "+err.message);
    }
  });

  module.exports = requestRouter;