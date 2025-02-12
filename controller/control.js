const users = require("../model/schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const userFound = await users.findOne({ email });
    if (userFound) {
      res.status(400).send({ msg: "user already exists" });
    } else {
      const newUser = new users(req.body);
      const salt = 10;
      const hPassword = bcrypt.hashSync(password, salt);
      newUser.password = hPassword;
      const secretKey = "abc123";
      const token = jwt.sign(
        { id: newUser._id, name: newUser.name },
        secretKey,
        { expiresIn: "7d" }
      );
      await newUser.save();
      res
        .status(200)
        .send({ msg: "registration complete", user: newUser, token });
    }
  } catch (error) {
    res.status(500).send({ msg: "error while registration", error });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await users.findOne({ email });
    if (!userFound) {
      res.status(400).send({ msg: "cretae account" });
    } else {
      const match = bcrypt.compareSync(password, userFound.password);
      if (!match) {
        res.status(400).send({ msg: "incorrect password" });
      } else {
        const secretKey = "abc124";
        const token = jwt.sign(
          { id: userFound._id, name: userFound.name },
          secretKey,
          { expiresIn: "7d" }
        );
        res.status(200).send({ msg: "login success", user: userFound, token });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: "failed to login ", error });
  }
};

exports.getCurrent = (req, res) => {
  const user = req.user;
  if (user) {
    res.status(200).send({ msg: "connecting user", user });
  } else {
    res.status(400).send({ msg: "u need to login first" });
  }
};
