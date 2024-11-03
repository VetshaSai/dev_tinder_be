const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express();
require("./config/database");
const cookieParser = require("cookie-parser");


//this middleware creted to convert json to JS object(it will pplicable for all routes)
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/", requestRouter);


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
