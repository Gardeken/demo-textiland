const Tela = require("../models/tela");
const telasRouter = require("express").Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/catalogo");
  },
  filename: function (req, file, cb) {
    const exp = file.originalname.split(".");
    cb(null, file.fieldname + "-" + Date.now() + "." + exp[1]);
  },
});
const upload = multer({ storage });
const fs = require("fs");

// Consultar Telas

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

telasRouter.get("/getTelaName", async (req, res) => {
  const { inputName } = req.query;
  const validarTela = await Tela.find({ name: inputName });
  if (validarTela.length < 1) {
    res.status(400).json({
      msg: "La tela no existe",
    });
  } else {
    res.status(200).json({
      msg: "La tela ya existe",
    });
  }
});

// Actualizar telas

telasRouter.put("/actualizarTela", async (req, res) => {
  const { id } = req.body;
  try {
    const actualizar = await Tela.findOneAndUpdate({ id: id }, req.body);
    res.status(200).json({ msg: "La tela se ha actualizado con éxito" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      msg: "Hubo un error al actualizar la tela",
    });
  }
});

// Crear telas

telasRouter.post(
  "/crearTela",
  upload.single("inputPhoto"),
  async (req, res) => {
    if (req.file === undefined) {
      return res.status(400).json({
        message: "Tiene que cargar un archivo antes de enviar",
      });
    }
    const { path } = req.file;
    const { name, type, price, usos, composicion, rendimiento } = req.body;
    const { listaColores } = req.query;
    const id = Date.now();
    const validarTela = await Tela.findOne({ name });
    try {
      const newTela = new Tela();
      newTela.name = name;
      newTela.type = type;
      newTela.price = price;
      newTela.usos_sugeridos = usos;
      newTela.composicion = composicion;
      newTela.rendimiento = rendimiento;
      newTela.photo = `../${path}`;
      newTela.colores = listaColores;
      newTela.id = id;
      newTela.save();
      res.status(200).json({ msg: "La tela se ha creado con éxito" });
    } catch (error) {
      res.status(400).json({ msg: "Hubo un error al crear la tela" });
    }
  }
);

// Eliminar telas

telasRouter.delete("/eliminarTela", async (req, res) => {
  let { idTela, pathTela } = req.query;
  try {
    const deleteTela = await Tela.findOneAndDelete({ id: idTela });
    const listPath = pathTela.split("/");
    pathTela = `src/catalogo/${listPath[3]}`;
    fs.unlink(pathTela, (err) => {
      if (err) {
        res.status(400).json({
          message: "Hubo un error al eliminar la asignación",
        });
      }
    });
    res.status(200).json({
      msg: "La tela se ha eliminado con éxito",
    });
  } catch (error) {
    res.status(400).json({
      msg: "Hubo un error al eliminar la tela",
    });
  }
});

module.exports = telasRouter;
