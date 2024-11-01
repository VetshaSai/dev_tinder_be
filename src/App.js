const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");
const { connectDb } = require("./config/database");
const User = require("./models/user");
//const user = require("./models/user");
const app = express();
require("./config/database");

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

//this middleware creted to convert json to JS object(it will pplicable for all routes)
app.use(express.json());

app.post("/signUp", async (req, res) => {
  //creating new instence of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added sucessfully...");
  } catch (err) {
    //console.log("error",err);
    res
      .status(404)
      .send(
        "something went wronmg while creating data in user schema" + err.message
      );
  }
});

app.get("/user", async (req, res) => {
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
    "photoUrl"
  ];
    isAllowedUpdate = Object.keys(data).every((k)=> allowedUpdate.includes(k));
    if(!isAllowedUpdate){
      throw new Error("Update not allowed");
    }
    if(data?.skills && data?.skills.length>10){
      throw new Error("Skills not allowed more than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: true,
      runValidators: true,
    });
    res.send("User data got updated");
  }
  catch (err) {
    res.status(400).send("while updating something went wrong: " + err.message);
  }
});
app.delete("/userDelete", async (req, res) => {
  try {
    const userDelete = req.body.emailId;
    await User.deleteOne({ emailId: userDelete });
    res.send("deleted sucessfully!!!");
  } catch (err) {
    res.status(404).send("user data not deleted... something went wrong!!");
  }
});

app.patch("/updateUserDetails", async (req, res) => {
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

app.get("/getAllUsers", async (req, res) => {
  try {
    const userData = await User.find({});
    res.send(userData);
  } catch (err) {
    res.status(404).send("user data not retrived");
  }
});
