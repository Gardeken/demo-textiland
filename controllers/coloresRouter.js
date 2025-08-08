const Color = require("../models/color");
const coloresRouter = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const uploadDir = path.join(__dirname, "..", "src", "colores");
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

coloresRouter.post(
  "/crearColor",
  upload.single("inputPhoto"),
  async (req, res) => {
    try {
      const nombreDeArchivo = req.file.filename;
      const rutaRelativaParaDB = path.join("src", "colores", nombreDeArchivo);
      const newColor = new Color();
      newColor.name = req.body.name;
      newColor.codigoHex = req.body.codigoHex;
      newColor.id = Date.now();
      if (req.file) {
        newColor.photo = rutaRelativaParaDB;
      }
      await newColor.save();
      res.status(200).json("El color se ha creado con éxito");
    } catch (error) {
      console.log(error);
      res.status(400).json("Hubo un error al crear el color");
    }
  }
);

coloresRouter.put(
  "/actualizarColor",
  upload.single("inputPhoto"),
  async (req, res) => {
    const { id } = req.query;
    try {
      if (req.file) {
        const nombreDeArchivo = req.file.filename;
        const rutaRelativaParaDB = path.join("src", "colores", nombreDeArchivo);
        req.body.photo = rutaRelativaParaDB;
      }
      await Color.findOneAndUpdate({ id: id }, req.body);
      res.status(200).json("El color se ha actualizado con éxito");
    } catch (error) {
      console.log(error);
      res.status(400).json("Hubo un error al actualizar el color");
    }
  }
);

coloresRouter.get("/getAll", async (req, res) => {
  try {
    const listaColores = await Color.find();
    res.status(200).json(listaColores);
  } catch (error) {
    res.status(400).json("Hubo un error al buscar las telas");
  }
});

coloresRouter.get("/getOne", async (req, res) => {
  const { id } = req.query;
  try {
    const consulta = await Color.findOne({ id: id });
    res.status(200).json(consulta);
  } catch (error) {
    res.status(400).json("No se consiguió el color");
  }
});

coloresRouter.delete("/eliminarColor", async (req, res) => {
  const { id } = req.query;
  try {
    const color = await Color.findOne({ id: id });
    if (color.photo) {
      await fs.unlink(color.photo);
    }
    await Color.findOneAndDelete({ id: id });
    res.status(200).json("El color se ha eliminado con éxito");
  } catch (error) {
    res.status(400).json("Hubo un error al eliminar el color");
  }
});

coloresRouter.delete("/eliminarFotoColor", async (req, res) => {
  const { id } = req.query;
  try {
    const color = await Color.findOne({ id: id });
    const rutaAbsoluta = path.join(__dirname, "..", color.photo);
    await fs.unlink(rutaAbsoluta);
    res.status(200).json("La foto se ha eliminado con éxito");
  } catch (error) {
    res.status(200).json("No se consiguió una foto");
  }
});

module.exports = coloresRouter;
