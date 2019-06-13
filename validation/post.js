const validator = require("validator");
const isEmpty = require("./is-empty");

// Validation logic for register route

module.exports = data => {
  const errors = {};
  // converting to string so that validator function param type matches
  // this is done for required fields as they need to be verified to be not empty
  const text = !isEmpty(data.text) ? data.text : "";

  // the core validation logic

  // text must be between 10 and 300 chars long
  if (!validator.isLength(text, { min: 10, max: 300 })) {
    errors.text = "Text field must be between 10 and 300 characters long";
  }
  // text field must exist
  if (validator.isEmpty(text)) {
    errors.text = "Text field must exist";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
