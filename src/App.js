const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("test test");
});

app.use("/hello", (req, res)=>{
    res.send("Helloooooo");
});

app.use("/mass",(req,res)=>{
    res.send("Mama mass ey ra bamaradi");
});

app.use("/", (req, res) => {
    res.send("Namste !!!!");
  });

app.listen(7777, () => {
  console.log("server is listening on port number 7777");
});
