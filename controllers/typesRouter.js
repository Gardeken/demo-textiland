const Type = require("../models/type");
const typesRouter = require("express").Router();

typesRouter.get("/getAll", async (req, res) => {
  try {
    const consulta = await Type.find();
    res.status(200).json(consulta);
  } catch (error) {
    res.status(400).json("Hubo un error al buscar los tipos");
  }
});

typesRouter.get("/getTypeNameVal", async (req, res) => {
  let { name } = req.query;
  try {
    const validarType = await Type.find({ name });
    if (validarType.length < 1) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(true);
    }
  } catch (error) {
    res.status(400).json("Hubo un error al buscar el tipo de tela");
  }
});

typesRouter.get("/getTypeCode", async (req, res) => {
  const { code } = req.query;
  try {
    const tipo = await Type.findOne({ code: code });
    res.status(200).json(tipo);
  } catch (error) {
    res.status(400).json("Hubo un error al encontrar el tipo de tela");
  }
});

typesRouter.post("/crearType", async (req, res) => {
  const { name } = req.body;
  const newType = new Type();
  newType.name = name;
  newType.code = Date.now();
  try {
    newType.save();
    res.status(200).json("El tipo de tela se ha creado con éxito");
  } catch (error) {
    res.status(400).json("Hubo un error al crear el tipo de tela");
  }
});

typesRouter.put("/editarType", async (req, res) => {
  const { code, name } = req.body;
  try {
    await Type.findOneAndUpdate(
      { code: code },
      {
        name: name,
      }
    );
    res.status(200).json("Se ha editado con éxito el tipo de tela");
  } catch (error) {
    res.status(400).json("Hubo un error al editar el tipo de tela");
  }
});

typesRouter.delete("/eliminarType", async (req, res) => {
  try {
    let { code } = req.query;
    await Type.findOneAndDelete({ code: code });
    res.status(200).json("El tipo de tela se ha eliminado con éxito");
  } catch (error) {
    res.status(400).json("Hubo un error al eliminar el tipo");
  }
});

module.exports = typesRouter;
