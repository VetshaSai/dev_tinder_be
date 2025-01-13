const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
//const user = require("../models/user");


authRouter.post("/signUp", async (req, res) => {
    try {
      const { firstName, lastName, password, emailId } = req.body;
      //Validating data by using helper function
      validateSignUpData(req);
  
      //Encrypting password
      passwordHash = await bcrypt.hash(password, 10);
      
      //creating new instence of the User model
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
  
      const savedData = await user.save();
      // creating JWT token
      const token = await savedData.getJWT();
  
      //Added token to cookie to send back to the user back
      res.cookie("token", token, {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
      
      res.json({message:"User added sucessfully...",
        data: savedData
      });

    } catch (err) {

      res.status(404).send("Error: " + err.message);
    }
  }); 

authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      const user = await User.findOne({ emailId: emailId });
  
      if (!user) {
        throw new Error("Invalid Credentials");
      }
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
      } else {
  
        // creating JWT token
        const token = await user.getJWT();
  
        //Added token to cookie to send back to the user back
        res.cookie("token", token, {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
  
        res.json({Message:"Login Succesfull", Data:user});
      }
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

  authRouter.post("/logout", async(req,res)=>{

    res.cookie("token", null , {expires : new Date(Date.now())});

    res.send("logout sucessfull");
  });

  authRouter.post("/passwordUpdate", async(req,res)=>{
    try{
        const {emailId,password,newPassword,confirmPassword} = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "New passwords do not match." });
          }

        const user = await User.findOne({emailId : emailId});

        //const isPasswordValidated = await user.validatePassword(password);
        
        if (!user || !(await user.validatePassword(password))) {
            return res.status(400).json({ error: "Invalid email or current password." });
          }
        
        user.password = await bcrypt.hash(confirmPassword,10);
        await user.save();

        res.json({message :`${user.emailId} password got updated sucessfully` });
    } catch(err){
        res.status(400).send("Error: "+ err.message);
    }
  });

module.exports =authRouter;