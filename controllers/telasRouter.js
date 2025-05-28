const telasRouter = require("express").Router();

const ruta = "http://localhost:3000/telas";

telasRouter.get("/getAll", async (req, res) => {
  try {
    const consulta = await fetch(ruta);
    const listado = await consulta.json();
    res.status(200).json(listado);
  } catch (error) {
    res.status(404).json({ msg: "No se han encontrado telas" });
  }
});

telasRouter.get("/getTela", async (req, res) => {
  const { idTela } = req.query;
  try {
    const consulta = await fetch(ruta + `/${idTela}`);
    const tela = await consulta.json();
    res.status(200).json(tela);
  } catch (error) {
    res.status(404).json({ msg: "No se han encontrado telas" });
  }
});

telasRouter.get("/getTelaType", async (req, res) => {
  const { Type } = req.query;
  try {
    const consulta = await fetch(ruta + `?Type=${Type}`);
    const listado = await consulta.json();
    res.status(200).json(listado);
  } catch (error) {
    res.status(404).json({ msg: "No se han encontrado telas" });
  }
});

module.exports = telasRouter;
