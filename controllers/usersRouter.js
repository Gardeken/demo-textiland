const user = require("../models/user");
const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");

userRouter.get("/getAdmin", async (req, res) => {
  const { username, password } = req.query;
  const consulta = await user.findOne({ username });
  if (consulta) {
    const comparacion = await bcrypt.compare(password, consulta.password);
    if (comparacion) {
      res.status(200).json({ message: "Contraseña válida" });
    } else {
      res.status(401).json({ message: "Contraseña inválida" });
    }
  } else {
    res.status(404).json({ message: "No se encontro el usuario" });
  }
});

module.exports = userRouter;
