require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// rutas
app.use('/auth', require('./routes/auth'));
app.use('/accounts', require('./routes/accounts'));
app.use('/transactions', require('./routes/transactions'));

// error handler simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI).then(()=> {
  app.listen(PORT, ()=> console.log(`API running on ${PORT}`));
});

app.use("/auth", require("./routes/auth"));
app.use("/accounts", require("./routes/accounts"));