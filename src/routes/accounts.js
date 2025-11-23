const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const accountController = require("../controllers/accountController");

// Todas las rutas requieren estar logueado
router.post("/", auth, accountController.createAccount);
router.get("/", auth, accountController.getAccounts);
router.get("/:id", auth, accountController.getAccountById);
router.put("/:id", auth, accountController.updateAccount);
router.delete("/:id", auth, accountController.deleteAccount);

module.exports = router;