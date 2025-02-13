const users = require("../model/schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const nodeMailer = require("nodemailer");

exports.emailValidation = async (req, res) => {
  const { email, name, password } = req.body;
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: { user: "wajihkurousagi@gmail.com", pass: "vagm seay dcmo ltnz" },
  });

  try {
    const user = await users.findOne({ email });
    if (user) {
      res.status(400).send({ msg: "account already exists" });
    } else {
      const secretKey = "abc123";
      const token = jwt.sign({ email, name, password }, secretKey, {
        expiresIn: "7d",
      });
      var mailOptions = {
        to: email,
        html: `
    <h1>helloo there,verify or go to hell</h1>
    <p>again,verify by clicking ont he link,not that hard right?</p>
    <a href="http://localholst:5000/verify/${token}">here!</a>
    `,
      };
      await transporter.sendMail(mailOptions, (error) => {
        if (error) throw error;
      });
      res.status(200).send({ msg: "mail verification sent " });
    }
  } catch (error) {
    res
      .status(500)
      .send({ msg: "error while trying to send a verification mail", error });
  }
};

exports.signUp = async (req, res) => {
  const tokenValid = req.params.token;

  try {
    const secretKey = "abc123";
    const decodeToken = jwt.verify(tokenValid, secretKey);
    const userFound = await users.findOne({ email: decodeToken.email });
    if (userFound) {
      res.status(400).send({ msg: "user already exists" });
    } else {
      const salt = 10;
      const hPassword = bcrypt.hashSync(decodeToken.password, salt);

      const newUser = new users({
        name: decodeToken.name,
        email: decodeToken.email,
        password: hPassword,
      });

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
    res.status(200).send({ msg: "connected user", user });
  } else {
    res.status(400).send({ msg: "u need to login first" });
  }
};
