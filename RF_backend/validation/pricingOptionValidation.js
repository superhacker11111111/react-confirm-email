const validator = require("validator");
const isEmpty = require("is-empty");

const validateRegisterInput = (data) => {
  let errors = {};
  //Convert empty fields to an empty string so we can use validator functions
  data.title = !isEmpty(data.title) ? data.title : "";

  //title Checks
  if (validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
const validateItemRegisterInput = (data) => {
  let errors = {};
  //Convert empty fields to an empty string so we can use validator functions
  data.license = !isEmpty(data.license) ? data.license : "";
  data.price = !isEmpty(data.price) ? data.price : "";

  //license Checks
  if (validator.isEmpty(data.license)) {
    errors.license = "License field is required";
  }

  //price Checks
  if (validator.isEmpty(data.price)) {
    errors.price = "Price field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateRegisterInput,
  validateItemRegisterInput,
};
