const express = require("express");
const app = express();

// app.use("/test", (req, res) => {
//   res.send("test test");
// });

app.get("/user", (req, res)=>{
    res.send([{name:"Sai", Salary: 2500000},{name:"Ram", Salary: 5500000}]);
});

app.post("/user",(req, res)=>{
  res.send("post data sent sucessfully");
});

app.delete("/user",(req,res)=>{
  res.send("Data deleted sucessfully...")
})

app.use("/mass",(req,res)=>{
    res.send("Mama mass ey ra bamaradi");
});

app.get("/abcd/:userId/:userName", (req,res)=>{
  console.log(req.params);
  res.send("Good Morningggg "+req.params.userName +"!!");
})
// app.use("/", (req, res) => {
//     res.send("Namste !!!!");
//   });

app.listen(7777, () => {
  console.log("server is listening on port number 7777");
});
