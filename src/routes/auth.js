const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");


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
  
      await user.save();
      res.send("User added sucessfully...");

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
  
        res.send("Login sucessfully...!");
      }
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

module.exports =authRouter;