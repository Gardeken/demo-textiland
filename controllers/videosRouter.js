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
const uploadVideo1 = multer({ storageVideo1 });
const uploadVideo2 = multer({ storageVideo2 });
const fs = require("fs").promises;

module.exports = videosRouter;
