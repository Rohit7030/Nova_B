const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Cement", "Steel", "Bricks", "Other"],
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    default: 0,
  },
  supplierName: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("Material", materialSchema);
