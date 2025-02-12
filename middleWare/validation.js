const { body, validationResult } = require("express-validator");

exports.signUpValidation = [
  body("email", "this email is not valid").isEmail(),
  body("password", "this password is not strong").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  }),
];

exports.signInValidation = [
  body("email", "this email is not valid ").isEmail(),
];
exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    res.status(400).send({ msg: "sth wrong with ur input", errors });
  }
};
