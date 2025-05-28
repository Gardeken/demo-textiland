const Tela = require("../models/tela");
const telasRouter = require("express").Router();

telasRouter.get("/getAll", async (req, res) => {
  try {
    const consulta = await Tela.find();
    res.status(200).json(consulta);
  } catch (error) {
    res.status(404).json({ msg: "No se han encontrado telas" });
  }
});

telasRouter.get("/getTela", async (req, res) => {
  const { idTela } = req.query;
  try {
    const consulta = await Tela.findOne({ id: idTela });
    res.status(200).json(consulta);
  } catch (error) {
    res.status(404).json({ msg: "No se han encontrado telas" });
  }
});

telasRouter.get("/getTelaType", async (req, res) => {
  const { Type } = req.query;
  try {
    const consulta = await Tela.find({ type: Type });
    res.status(200).json(consulta);
  } catch (error) {
    res.status(404).json({ msg: "No se han encontrado telas" });
  }
});

module.exports = telasRouter;
