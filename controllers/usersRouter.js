const user = require("../models/user");
const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");

userRouter.post("/getAdmin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const consulta = await user.findOne({ username });
    if (!consulta) {
      return res.status(404).json({ message: "No se encontro el usuario" });
    }
    const comparacion = await bcrypt.compare(password, consulta.password);
    if (comparacion) {
      res.status(200).json({ message: "Contraseña válida", rol: consulta.rol });
    } else {
      res.status(401).json({ message: "Contraseña inválida" });
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = userRouter;
