const mongoose = require("mongoose");

connectDb = async ()=>{
   await mongoose.connect("mongodb+srv://durgaraovetsha:EWmNLVnji1e6Oy1p@cluster0.w1bkd.mongodb.net/devTinder");
}

module.exports={connectDb};

