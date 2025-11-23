const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validaciones básicas
    if (!name || !email || !password)
      return res.status(400).json({ error: "Datos incompletos" });

    // verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Email ya registrado" });

    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // guardar nuevo usuario
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // buscar usuario
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    // comparar contraseñas
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Contraseña incorrecta" });

    // generar JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;