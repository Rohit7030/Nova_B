const Material = require("../models/Material");

// GET all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch materials", error: err.message });
  }
};

// GET single material
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json(material);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch material", error: err.message });
  }
};

// CREATE new material
exports.createMaterial = async (req, res) => {
  try {
    const { name, category, unitPrice, availableQuantity, supplierName } = req.body;

    const newMaterial = new Material({
      name,
      category,
      unitPrice,
      availableQuantity,
      supplierName,
    });

    await newMaterial.save();
    res.status(201).json({ message: "Material created successfully", material: newMaterial });
  } catch (err) {
    res.status(500).json({ message: "Failed to create material", error: err.message });
  }
};

// UPDATE material
exports.updateMaterial = async (req, res) => {
  try {
    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMaterial) return res.status(404).json({ message: "Material not found" });
    res.json({ message: "Material updated successfully", material: updatedMaterial });
  } catch (err) {
    res.status(500).json({ message: "Failed to update material", error: err.message });
  }
};

// DELETE material
exports.deleteMaterial = async (req, res) => {
  try {
    const deleted = await Material.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Material not found" });
    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete material", error: err.message });
  }
};
