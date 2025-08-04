const videosRouter = require("express").Router();
const multer = require("multer");
const storageVideo1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src");
  },
  filename: function (req, file, cb) {
    const exp = file.originalname.split(".");
    cb(null, "video-home-1" + "." + exp[1]);
  },
});
const storageVideo2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src");
  },
  filename: function (req, file, cb) {
    const exp = file.originalname.split(".");
    cb(null, "video-home-2" + "." + exp[1]);
  },
});
const storageVideo3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src");
  },
  filename: function (req, file, cb) {
    const exp = file.originalname.split(".");
    cb(null, "video-home-3" + "." + exp[1]);
  },
});
const uploadVideo1 = multer({ storage: storageVideo1 });
const uploadVideo2 = multer({ storage: storageVideo2 });
const uploadVideo3 = multer({ storage: storageVideo3 });
const fs = require("fs").promises;

videosRouter.delete("/eliminarVideo1", async (req, res) => {
  try {
    await fs.unlink("src/video-home-1.mp4");
    res.status(200).json("El video se ha borrado con éxito");
  } catch (error) {
    res.status(200).json("Hubo un error al cambiar el video");
  }
});

videosRouter.delete("/eliminarVideo2", async (req, res) => {
  try {
    await fs.unlink("src/video-home-2.mp4");
    res.status(200).json("El video se ha borrado con éxito");
  } catch (error) {
    res.status(200).json("Hubo un error al cambiar el video");
  }
});

videosRouter.delete("/eliminarVideo3", async (req, res) => {
  try {
    await fs.unlink("src/video-home-3.mp4");
    res.status(200).json("El video se ha borrado con éxito");
  } catch (error) {
    res.status(200).json("Hubo un error al cambiar el video");
  }
});

videosRouter.post(
  "/guardarVideo1",
  uploadVideo1.single("inputVideo"),
  async (req, res) => {
    if (req.file) {
      res.send("Video subido exitosamente.");
    } else {
      res.status(400).json("Hubo un error al cambiar el video");
    }
  }
);

videosRouter.post(
  "/guardarVideo2",
  uploadVideo2.single("inputVideo"),
  async (req, res) => {
    if (req.file) {
      res.send("Video subido exitosamente.");
    } else {
      res.status(400).json("Hubo un error al cambiar el video");
    }
  }
);

videosRouter.post(
  "/guardarVideo3",
  uploadVideo3.single("inputVideo"),
  async (req, res) => {
    if (req.file) {
      res.send("Video subido exitosamente.");
    } else {
      res.status(400).json("Hubo un error al cambiar el video");
    }
  }
);

module.exports = videosRouter;
