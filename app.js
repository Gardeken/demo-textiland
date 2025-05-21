const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use("/", express.static(path.resolve("views", "home")));

module.exports = app;
