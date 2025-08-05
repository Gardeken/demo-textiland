const mongoose = require("mongoose");
const telasRouter = require("../controllers/telasRouter");

const TelaSchema = new mongoose.Schema({
  id: String,
  name: String,
  photo: String,
  type: String,
  price: Number,
  ancho: String,
  usos_sugeridos: String,
  composicion: String,
  rendimiento: Number,
  colores: String,
});

const Tela = mongoose.model("Tela", TelaSchema);

module.exports = Tela;
