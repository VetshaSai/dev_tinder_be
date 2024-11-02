const express = require("express");
const { userAuth } = require("./middleware/auth");
const { connectDb } = require("./config/database");
const User = require("./models/user");
//const user = require("./models/user");
const app = express();
require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwtWebToken = require("jsonwebtoken");

//this middleware creted to convert json to JS object(it will pplicable for all routes)
app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
  try {
    const { firstName, lastName, password, emailId } = req.body;
    //Validating data by using helper function
    validateSignUpData(req);

    //Encrypting password
    passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
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
    //console.log("error",err);
    res.status(404).send("Error: " + err.message);
  }
});

app.post("/login", async (req, res) => {
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

app.get("/profile",userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

app.get ("/sendConnectionRequest",userAuth, async(req,res)=>{
  try{
    const user = req.user;
    const {firstName} = user;
    res.send(firstName+" connection request sent !!!");
  } catch(err){
    res.status(401).send("Error: "+err.message);
  }
});

app.get("/userByEmail", async (req, res) => {
  try {
    const userBody = req.body.emailId;
    const users = await User.find({ emailId: userBody });
    if (users.length === 0) {
      res.status(404).send("users not found!!!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("user data not retrived... something went wrong!!");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete({ _id: userId });
    res.send("User data deleted");
  } catch (err) {
    res.status(400).send("error while deleting");
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  //console.log(userId);
  const data = req.body;
  //console.log(data);
  try {
    //Implementing API level validation...
    const allowedUpdate = [
      "userId",
      "gender",
      "skills",
      "age",
      "aboutUs",
      "photoUrl",
    ];
    isAllowedUpdate = Object.keys(data).every((k) => allowedUpdate.includes(k));
    if (!isAllowedUpdate) {
      throw new Error("Update not allowed");
    }
    if (data?.skills && data?.skills.length > 10) {
      throw new Error("Skills not allowed more than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: true,
      runValidators: true,
    });
    res.send("User data got updated");
  } catch (err) {
    res.status(400).send("while updating something went wrong: " + err.message);
  }
});
app.delete("/userByEmail", async (req, res) => {
  try {
    const userDelete = req.body.emailId;
    await User.deleteOne({ emailId: userDelete });
    res.send("deleted sucessfully!!!");
  } catch (err) {
    res.status(404).send("user data not deleted... something went wrong!!");
  }
});

app.patch("/userByEmail", async (req, res) => {
  try {
    const userUpdate = req.body.emailId;
    await User.updateOne(
      { emailId: userUpdate },
      { $set: { lastName: "Hitman" } },
      { runValidators: true }
    );
    res.send("user dtls got updated");
  } catch (err) {
    res.status(404).send("user data not updated..!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const userData = await User.find({});
    res.send(userData);
  } catch (err) {
    res.status(404).send("user data not retrived");
  }
});

connectDb()
  .then(() => {
    console.log("Database estabilished sucessfully...");
    app.listen(7777, () => {
      console.log("server is listening on port number 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection not estabilished sucessfully...");
  });
