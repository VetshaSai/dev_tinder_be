const express = require("express");
const {adminAuth,userAuth} = require("./middleware/auth");
const app = express();

app.get("/user",(req,res)=>{
  res.send("user data retrived...")
});

// applying admin auth for admin related routes
app.use("/admin",adminAuth );

app.get("/admin/GetAllData",(req,res)=>{
  res.send("Get all the data");
});

app.delete("/admin/DeleteData",(req,res)=>{
  res.send("Admin deleted data sucessfully...");
});

app.get("/user/getDetails",(req,res)=>{
  res.send("User dtls retrived sucessfully....");
});
app.delete("/user/deleteUser",userAuth,(req,res)=>{
  res.send("Deleted User data sucessfully");
});
app.listen(7777, () => {
  console.log("server is listening on port number 7777");
});
