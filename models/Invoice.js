const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  materials: [
    {
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      gstRate:{
        type:Number,
        default:18
      },
      gstAmount:{
        type:Number
      },
      totalWithGst:{
        type:Number
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
