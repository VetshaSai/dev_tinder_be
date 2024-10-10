const express = require("express");
const app = express();

// app.use("/test", (req, res) => {
//   res.send("test test");
// });

app.use(
  "/user",

  [(req, res, next) => {
    next();
    //res.send("hiiiiii");
  },
  (req, res, next) => {
    next();
    //res.send("2nd response");
  }],
  (req, res) => {
    res.send("3rd Response");
  })

// app.get("/abcd/:userId/:userName", (req,res)=>{
//   console.log(req.params);
//   res.send("Good Morningggg "+req.params.userName +"!!");
// })
// app.use("/", (req, res) => {
//     res.send("Namste !!!!");
//   });

app.listen(7777, () => {
  console.log("server is listening on port number 7777");
});
