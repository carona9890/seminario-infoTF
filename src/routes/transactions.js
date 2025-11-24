const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

// Crear transacción (INCOME, EXPENSE o TRANSFER)
router.post("/", auth, async (req, res) => {
  try {
    const { accountId, type, amount, description, fromAccount, toAccount } = req.body;

    if (type === "TRANSFER") {
      if (!fromAccount || !toAccount || !amount)
        return res.status(400).json({ error: "Datos incompletos para transferencia" });

      // Debitar origen
      const origin = await Account.findOne({ _id: fromAccount, user: req.user.id });
      if (!origin) return res.status(404).json({ error: "Cuenta origen no encontrada" });
      if (origin.balance < amount)
        return res.status(400).json({ error: "Fondos insuficientes" });

      origin.balance -= amount;
      await origin.save();

      // Acreditar destino
      const dest = await Account.findOne({ _id: toAccount, user: req.user.id });
      if (!dest) return res.status(404).json({ error: "Cuenta destino no encontrada" });

      dest.balance += amount;
      await dest.save();

      return res.json({ message: "Transferencia realizada con éxito" });
    }

    // INCOME o EXPENSE
    const account = await Account.findOne({ _id: accountId, user: req.user.id });
    if (!account) return res.status(404).json({ error: "Cuenta no encontrada" });

    const newTransaction = new Transaction({
      accountId,
      type,
      amount,
      description,
      user: req.user.id
    });

    await newTransaction.save();

    // actualizar balance
    if (type === "INCOME") account.balance += amount;
    else if (type === "EXPENSE") account.balance -= amount;

    await account.save();

    res.json({ message: "Transacción creada", transaction: newTransaction });

  } catch (err) {
  console.error("ERROR en /transactions:", err);
  res.status(500).json({ error: err.message });
  }
});

// Obtener todas las transacciones del usuario
router.get("/", auth, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(transactions);
});

module.exports = router;