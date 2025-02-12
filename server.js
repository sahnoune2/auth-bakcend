const express = require("express");
const config = require("./config/config");
const userRouter = require("./router/router");
const port = 5000;

const app = express();
app.use(express.json());
config();

app.use("/user", userRouter);


app.listen(port, () => {
  console.log("server is running");
});
