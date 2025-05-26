const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use("/", express.static(path.resolve("views", "home")));
app.use("/catalogo", express.static(path.resolve("views", "catalogo")));
app.use("/telas", express.static(path.resolve("views", "telas")));
app.use(express.static("src"));

module.exports = app;
