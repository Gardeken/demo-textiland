const Tela = require("../models/tela");
const telasRouter = require("express").Router();
const multer = require("multer");
const path = require("path");
const uploadDir = path.join(__dirname, "..", "src", "catalogo");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const nameF = req.body.name;
    const extension = path.extname(file.originalname);
    const filename = `${nameF
      .replace("/", "-")
      .replace(" ", "-")}-${Date.now()}${extension}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });
const fs = require("fs").promises;

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

telasRouter.get("/getTelaNameValidar", async (req, res) => {
  const { inputName } = req.query;
  try {
    const validarTela = await Tela.find({ name: inputName });
    if (validarTela.length < 1) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(true);
    }
  } catch (error) {
    res.status(400).json({
      msg: "Hubo un error al verificar la tela",
    });
  }
});

// Actualizar telas

telasRouter.post(
  "/actualizarTela",
  upload.single("inputPhoto"),
  async (req, res) => {
    const { id } = req.query;
    if (req.file) {
      const nombreDeArchivo = req.file.filename;
      const rutaRelativaParaDB = path.join("src", "catalogo", nombreDeArchivo);
      req.body.photo = rutaRelativaParaDB;
      try {
        await Tela.findOneAndUpdate({ id: id }, req.body);
        res.status(200).send("Se ha actualizado la tela con foto");
      } catch (error) {
        res.status(400).send("Hubo un error al actualizar la tela con foto");
      }
    } else {
      try {
        await Tela.findOneAndUpdate({ id: id }, req.body);
        res
          .status(200)
          .send("Se ha actualizado la tela sin cambios en la foto");
      } catch (error) {
        res.status(400).send("Hubo un error al actualizar la tela sin foto");
      }
    }
  }
);

// Crear telas

telasRouter.post(
  "/crearTela",
  upload.single("inputPhoto"),
  async (req, res) => {
    let { name, type, price, usos, composicion, rendimiento, ancho } = req.body;
    const id = Date.now();
    price = price.replace(",", ".");
    rendimiento = rendimiento.replace(",", ".");
    const nombreDeArchivo = req.file.filename;
    const rutaRelativaParaDB = path.join("src", "catalogo", nombreDeArchivo);
    try {
      const newTela = new Tela();
      newTela.name = name;
      newTela.type = type.toString();
      newTela.ancho = ancho;
      newTela.price = Number(price);
      newTela.usos_sugeridos = usos;
      newTela.composicion = composicion;
      newTela.rendimiento = Number(rendimiento);
      newTela.photo = rutaRelativaParaDB;
      newTela.id = id;
      await newTela.save();
      res.status(200).json({ msg: "La tela se ha creado con éxito" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "Hubo un error al crear la tela" });
    }
  }
);

// Eliminar telas

telasRouter.delete("/eliminarTela", async (req, res) => {
  let { idTela } = req.query;
  try {
    const telaAeliminar = await Tela.findOne({ id: idTela });
    const rutaAbsoluta = path.join(__dirname, "..", telaAeliminar.photo);
    await fs.unlink(rutaAbsoluta);
    await Tela.findOneAndDelete({ id: idTela });
    res.status(200).json({
      msg: "La tela se ha eliminado con éxito",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Hubo un error al eliminar la tela",
    });
  }
});

// Eliminar foto

telasRouter.delete("/eliminarFotoTela", async (req, res) => {
  let { idTela } = req.query;
  try {
    const telaAeliminar = await Tela.findOne({ id: idTela });
    const rutaAbsoluta = path.join(__dirname, "..", telaAeliminar.photo);
    await fs.unlink(rutaAbsoluta);
    res.status(200).json({
      msg: "La foto se ha eliminado con éxito",
    });
  } catch (error) {
    res.status(200).json("No se consiguio la imagen");
  }
});

module.exports = telasRouter;
