const mongoose = require("mongoose");

const config = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://krimiseif140:VAqweZMrXclUEZCO@cluster0.nk16i.mongodb.net/Users_Db"
    );
    console.log("database connected successfully");
  } catch (error) {
    console.log("error while trying to connect to database");
  }
};
module.exports = config;
