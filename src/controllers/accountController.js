const Account = require("../models/Account");

//crear cuenta
exports.createAccount = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name)
      return res.status(400).json({ error: "El nombre es obligatorio" });

    const account = new Account({
      userId: req.user.id,
      name,
      type: type || "SAVINGS",
      balance: 0
    });

    await account.save();
    res.json(account);

  } catch (err) {
    res.status(500).json({ error: "Error al crear la cuenta" });
  }
};

//listar cuentas del usuario logueado
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener cuentas" });
  }
};

//obtener cuenta por ID
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!account)
      return res.status(404).json({ error: "Cuenta no encontrada" });

    res.json(account);

  } catch (err) {
    res.status(500).json({ error: "Error al obtener la cuenta" });
  }
};

//actualizar cuenta
exports.updateAccount = async (req, res) => {
  try {
    const { name, type } = req.body;

    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, type },
      { new: true }
    );

    if (!account)
      return res.status(404).json({ error: "Cuenta no encontrada" });

    res.json(account);

  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la cuenta" });
  }
};

//eliminar cuenta (no testeado)
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!account)
      return res.status(404).json({ error: "Cuenta no encontrada" });

    res.json({ message: "Cuenta eliminada" });

  } catch (err) {
    res.status(500).json({ error: "Error al eliminar cuenta" });
  }
};