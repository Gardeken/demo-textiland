require("dotenv").config();
const express = require("express");
const mongoDB = require("mongoose");
const app = express();
const path = require("path");
const telasRouter = require("./controllers/telasRouter");
const pass = process.env.MONGO_PASS;

async function ConectarBD() {
  try {
    await mongoDB.connect(pass);
    console.log("Se ha conectado a la base de datos");
  } catch (error) {
    console.log(error);
  }
}

ConectarBD();

app.use(express.json());
app.use("/", express.static(path.resolve("views", "home")));
app.use("/catalogo", express.static(path.resolve("views", "catalogo")));
app.use("/adminPanel", express.static(path.resolve("views", "adminPanel")));
app.use("/telas", express.static(path.resolve("views", "telas")));
app.use("/src", express.static(path.resolve("src")));

app.use("/api/telas", telasRouter);

module.exports = app;
