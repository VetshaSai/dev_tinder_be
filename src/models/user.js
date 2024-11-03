const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("It's not a strong password");
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not correct one");
        }
      },
    },
    skills: {
      type: [String],
      //DB level validation
      // validate(value){
      //   if(value.length >10){
      //     throw new Error("not allowed more tha 10");
      //   }
      // }
    },
    aboutUs: {
      type: String,
      default: "I'm very interested to discuss about  JS & Node Js ",
    },
    photoUrl: {
      type: String,
      default:
        "https://png.pngtree.com/png-vector/20190501/ourmid/pngtree-users-icon-design-png-image_1014936.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("photo url is not correct");
        }
      },
    },
  },
  { timestamps: true }
);

//always prefer nrml function not arrow functions for schema methods because this obj will work differently for arrow methods

userSchema.methods.validatePassword = async function(passwordInputByUser){

  user = this;
  passwordHash =user.password; 

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;

};

userSchema.methods.getJWT = async function(){
  const user = this;

  // creating JWT token
  const token = jwt.sign({_id : user._id},"D$vTinder007",{expiresIn:"7d"});

  return token;
};

module.exports = mongoose.model("User", userSchema);
