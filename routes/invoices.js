const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
} = require("../controllers/invoiceController");

const authMiddleware = require("../middleware/authMiddleware");

// All routes protected
router.post("/", authMiddleware, createInvoice);
router.get("/", authMiddleware, getAllInvoices);
router.get("/:id", authMiddleware, getInvoiceById);

module.exports = router;
