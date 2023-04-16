const { check } = require("express-validator");

const validatorSignup = () => {
  const command = [
    check("email", "Email length should be 10 to 30 characters")
      .isEmail()
      .isLength({ min: 10 }),
    check(
      "password",
      "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character."
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
  ];
  return command;
};

const validatorLogin = () => {
  const command = [
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("password", "Invalid does no Empty").not().isEmpty(),
    check("password", "Invalid length is at least 8 characters").isLength({
      min: 8,
    }),
    check("password", "Invalid contain special characters").matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/
    ),
  ];
  return command;
};

const validate = {
  validatorSignup: validatorSignup,
  validatorLogin: validatorLogin,
};

module.exports = validate;
