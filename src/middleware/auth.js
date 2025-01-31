const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth =
  ("/user",
  async (req, res, next) => {
    //Read token form req auth
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).send("please login!");
      }
      // decode from the token
      const decodeMessage = jwt.verify(token, process.env.JWT_SECRET);
      const { _id } = decodeMessage;
      // find the user in db
      const user = await User.findById(_id);
      if (!user) {
        throw new Error("User not found...");
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

module.exports = { userAuth };
