const mongoose = require("mongoose");
const telasRouter = require("../controllers/telasRouter");

const ColorSchema = new mongoose.Schema({
  id: String,
  name: String,
  photo: String,
  codigoHex: String,
});

const Color = mongoose.model("Color", ColorSchema);

module.exports = Color;
