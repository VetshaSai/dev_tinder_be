const mongoose = require("mongoose");

connectDb = async ()=>{
   await mongoose.connect(process.env.DB_CONNECTION_SECRETE);
}

module.exports={connectDb};

