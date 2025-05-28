const express = require("express");
const app = express();
const path = require("path");
const telasRouter = require("./controllers/telasRouter");

app.use(express.json());
app.use("/", express.static(path.resolve("views", "home")));
app.use("/catalogo", express.static(path.resolve("views", "catalogo")));
app.use("/telas", express.static(path.resolve("views", "telas")));
app.use("/src", express.static(path.resolve("src")));

app.use("/api/telas", telasRouter);

module.exports = app;
