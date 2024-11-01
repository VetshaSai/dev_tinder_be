const mongoose = require("mongoose");

/**
 * Defines the schema for a user in a MongoDB database using Mongoose.
 * @param {Object} userSchema - The schema definition for a user.
 * @returns A Mongoose schema object for the user.
 */
const userSchema = new mongoose.Schema(
  {
  firstName: {
    type: String,
    required: true,
    uppercase: true,
    minLength: 3,
    maxLength: 15,
  },
  lastName: { type: String },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String },
  age: { type: Number, min: 18 },
  gender: { type: String,
    validate(value)  {
      if(!["male","female","others"].includes(value)){
        throw new Error("Gender data is not correct one");
      }
    }

   },
  skills: { type: [String] },
  aboutUs : { type: String, default:"I'm very interested to discuss about  JS & Node Js "},
  photoUrl : { type : String, default:"https://png.pngtree.com/png-vector/20190501/ourmid/pngtree-users-icon-design-png-image_1014936.jpg"}
}, {timestamps:true});

module.exports = mongoose.model("User", userSchema);
