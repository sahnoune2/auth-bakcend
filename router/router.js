const express = require("express");
const { signUp, signIn, getCurrent } = require("../controller/control");
const {
  signUpValidation,
  validation,
  signInValidation,
} = require("../middleWare/validation");
const { isAuth } = require("../middleWare/isAuth");

const userRouter = express.Router();

userRouter.post("/signUp", signUpValidation, validation, signUp);
userRouter.post("/signIn", signInValidation, validation, signIn);
userRouter.get("/getCurrent", isAuth, getCurrent);

module.exports = userRouter;
