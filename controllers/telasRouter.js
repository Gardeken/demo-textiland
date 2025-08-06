const Tela = require("../models/tela");
const telasRouter = require("express").Router();
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/catalogo");
  },
  filename: function (req, file, cb) {
    const exp = file.originalname.split(".");
    cb(null, file.fieldname + "-" + Date.now() + "." + exp[1]);
  },
});
const storageChange = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/catalogo");
  },
  filename: function (req, file, cb) {
    const nombreFinal = req.nombreDeArchivoGuardado;
    if (!nombreFinal) {
      const nombreTemporal =
        file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      return cb(null, nombreTemporal);
    }
    const extension = path.extname(file.originalname);
    cb(null, path.parse(nombreFinal).name + extension);
  },
});
const upload = multer({ storage });
const change = multer({ storage: storageChange });
const fs = require("fs").promises;

const buscarNombreDeArchivo = async (req, res, next) => {
  if (!req.query.id) {
    return res.status(400).send("Falta el ID del producto.");
  }

  const tela = await Tela.findOne({ id: req.query.id });

  if (!tela) {
    return res.status(404).send("Producto no encontrado.");
  }
  const { photo } = tela;
  const listTelaPhoto = photo.split("/");
  const TelaPhoto = listTelaPhoto[2];
  req.nombreDeArchivoGuardado = TelaPhoto;
  next();
};

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
  buscarNombreDeArchivo,
  change.single("inputPhoto"),
  async (req, res) => {
    const { id } = req.query;
    if (req.file) {
      const photoPath = req.file.path.replace(/\\/g, "/");
      req.body.photo = photoPath;
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
    const { path } = req.file;
    let { name, type, price, usos, composicion, rendimiento, ancho } = req.body;
    const { listaColores } = req.query;
    const id = Date.now();
    price = price.replace(",", ".");
    try {
      const newTela = new Tela();
      newTela.name = name;
      newTela.type = type.toString();
      newTela.ancho = ancho;
      newTela.price = Number(price);
      newTela.usos_sugeridos = usos;
      newTela.composicion = composicion;
      newTela.rendimiento = rendimiento;
      newTela.photo = path;
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
  let { idTela } = req.query;
  try {
    const telaAeliminar = await Tela.findOne({ id: idTela });
    await fs.unlink(telaAeliminar.photo);
    await Tela.findOneAndDelete({ id: idTela });
    res.status(200).json({
      msg: "La tela se ha eliminado con éxito",
    });
  } catch (error) {
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
    await fs.unlink(telaAeliminar.photo);
    res.status(200).json({
      msg: "La foto se ha eliminado con éxito",
    });
  } catch (error) {
    res.status(200).json("No se consiguio la imagen");
  }
});

module.exports = telasRouter;
