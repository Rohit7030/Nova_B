const express = require("express");
const router = express.Router();
const {
  addInventory,
  getAllInventory,
  getInventorySummary
} = require("../controllers/inventoryController");

const authMiddleware = require("../middleware/authMiddleware");

// All routes protected
router.post("/", authMiddleware, addInventory);
router.get("/", authMiddleware, getAllInventory);
router.get("/summary", authMiddleware, getInventorySummary);

module.exports = router;
