const mongoose = require("mongoose");
const typesRouter = require("../controllers/typesRouter");

const typeSchema = new mongoose.Schema({
  name: String,
  code: String,
});

const Type = mongoose.model("Type", typeSchema);

module.exports = Type;
