const express = require("express");
const router = express.Router();
const {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
} = require("../controllers/materialController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes protected
router.get("/", authMiddleware, getAllMaterials);
router.get("/:id", authMiddleware, getMaterialById);
router.post("/", authMiddleware, createMaterial);
router.put("/:id", authMiddleware, updateMaterial);
router.delete("/:id", authMiddleware, deleteMaterial);

module.exports = router;
