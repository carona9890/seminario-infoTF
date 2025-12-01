const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const validate = require("../middlewares/validate");
const { transactionSchema } = require("../validators/transactions");

//crear transaccion 
router.post("/", auth, validate(transactionSchema), async (req, res) => {
  try {
    const { accountId, type, amount, description, fromAccount, toAccount } = req.body;

    if (type === "TRANSFER") {
      if (!fromAccount || !toAccount || !amount)
        return res.status(400).json({ error: "Datos incompletos para transferencia" });

      //debitar origen
      const origin = await Account.findOne({ _id: fromAccount, userId: req.user.id });
      if (!origin) return res.status(404).json({ error: "Cuenta origen no encontrada" });
      if (origin.balance < amount)
        return res.status(400).json({ error: "Fondos insuficientes" });

      origin.balance -= amount;
      await origin.save();

      //acreditar destino
      const dest = await Account.findOne({ _id: toAccount, userId: req.user.id });
      if (!dest) return res.status(404).json({ error: "Cuenta destino no encontrada" });

      dest.balance += amount;
      await dest.save();

      return res.json({ message: "Transferencia realizada con éxito" });
    }

    //INCOME/EXPENSE
    const account = await Account.findOne({ _id: accountId, userId: req.user.id });
    if (!account) return res.status(404).json({ error: "Cuenta no encontrada" });

    const newTransaction = new Transaction({
      accountId,
      type,
      amount,
      description,
      userId: req.user.id
    });

    await newTransaction.save();

    //actualizar balance
    if (type === "INCOME") account.balance += amount;
    else if (type === "EXPENSE") account.balance -= amount;

    await account.save();

    res.json({ message: "Transacción creada", transaction: newTransaction });

  } catch (err) {
    console.error("ERROR en /transactions:", err);
    res.status(500).json({ error: err.message });
  }
});

//obtener todas las transacciones del usuario 
router.get("/", auth, async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(transactions);
});

module.exports = router;