const validator = require("validator");
const isEmpty = require("./is-empty");

// Validation logic for register route

let errors = {};

module.exports = data => {
  // converting to string so that validator function param type matches
  // this is done for required fields as they need to be verified to be not empty
  const school = !isEmpty(data.school) ? data.school : "";
  const fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  const from = !isEmpty(data.from) ? data.from : "";
  const degree = !isEmpty(data.degree) ? data.degree : "";
  // the core validation logic

  // degree field must exist
  if (validator.isEmpty(degree)) {
    errors.degree = "Degree field must exist";
  }

  // school field must exist
  if (validator.isEmpty(school)) {
    errors.school = "School field must exist";
  }

  // from field must exist
  if (validator.isEmpty(from)) {
    errors.from = "From date field must exist";
  }

  // fieldofstudy field must exist
  if (validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = "Field of study field must exist";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
