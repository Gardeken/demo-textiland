const mongoose = require("mongoose");
const userRouter = require("../controllers/usersRouter");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  id: Number,
  rol: Number,
});

const user = mongoose.model("user", userSchema);

module.exports = user;
