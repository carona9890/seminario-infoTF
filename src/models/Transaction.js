const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  type: {
    type: String,
    enum: ["INCOME", "EXPENSE", "TRANSFER"],
    required: true
  },

  amount: { type: Number, required: true },
  category: { type: String },
  description: { type: String },

  // Para transferencias
  fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  toAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },

  date: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);