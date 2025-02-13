const express = require("express");
const {
  signUp,
  signIn,
  getCurrent,
  emailValidation,
} = require("../controller/control");
const {
  signUpValidation,
  validation,
  signInValidation,
} = require("../middleWare/validation");
const { isAuth } = require("../middleWare/isAuth");

const userRouter = express.Router();

userRouter.post("/signUp/:token", signUp);
userRouter.post("/signIn", signInValidation, validation, signIn);
userRouter.get("/getCurrent", isAuth, getCurrent);
userRouter.post("/email", signUpValidation, validation, emailValidation);

module.exports = userRouter;
