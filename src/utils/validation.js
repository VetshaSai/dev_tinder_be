const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, password, emailId } = req.body;

  if (!firstName || !lastName) {
    throw new Error("name not valid..");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password!");
  }
};

const validateProfileEdit = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "skills",
    "aboutUs",
    "photoUrl",
    "age",
    "gender"
  ];

  const isAllowedToEdit = Object.keys(req.body).every((keys) =>
    allowedEditFields.includes(keys)
  );

  return isAllowedToEdit;
};

module.exports = { validateSignUpData, validateProfileEdit };
