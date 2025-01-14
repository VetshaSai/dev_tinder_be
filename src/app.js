const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express();
require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");


//this middleware creted to convert json to JS object(it will pplicable for all routes)
app.use(cors({
  origin:"http://localhost:5173",
  // methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Include PATCH
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter);


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
