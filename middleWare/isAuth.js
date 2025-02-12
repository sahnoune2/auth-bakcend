const jwt = require("jsonwebtoken");
const users = require("../model/schema");

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.header("token");
    console.log(token);
    const secretKey = "abc123";
    const verify = jwt.verify(token, secretKey);
    console.log(verify);
    const user = await users.findById(verify.id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).send({ msg: "you are not authorized" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ msg: "error while trying  to verify authentifaction" });
  }
};
