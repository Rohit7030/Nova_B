const Invoice = require("../models/Invoice");
const Material = require("../models/Material");

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { materials } = req.body;

    if (!materials || !materials.length) {
      return res.status(400).json({ message: "Invoice must contain at least one item." });
    }

    let totalAmount = 0;
    const invoiceMaterials = [];

    for (const item of materials) {
      const mat = await Material.findById(item.material);
      if (!mat) return res.status(404).json({ message: `Material not found: ${item.material}` });

      // Check stock
      if (mat.availableQuantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${mat.name}` });
      }

      // Basic calculations
      const quantity = item.quantity;
      const unitPrice = mat.unitPrice;
      const total = unitPrice * quantity;

      // ✅ GST logic
      const gstRate = item.gstRate || 18; // default to 18% if not provided
      const gstAmount = (total * gstRate) / 100;
      const totalWithGst = total + gstAmount;

      totalAmount += totalWithGst;

      // Update stock
      mat.availableQuantity -= quantity;
      await mat.save();

      // Push item to invoice
      invoiceMaterials.push({
        material: mat._id,
        quantity,
        unitPrice,
        total,
        gstRate,
        gstAmount,
        totalWithGst,
      });
    }

    const newInvoice = await Invoice.create({
      materials: invoiceMaterials,
      totalAmount,
    });

    res.status(201).json({ message: "Invoice generated", invoice: newInvoice });

  } catch (err) {
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .select("_id totalAmount createdAt");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
  }
};

// Get single invoice with material details
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("materials.material", "name category")
      .lean();

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoice", error: err.message });
  }
};
