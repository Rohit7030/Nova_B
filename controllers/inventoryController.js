const Inventory = require("../models/Inventory");
const Material = require("../models/Material");

// ADD inflow or outflow entry
exports.addInventory = async (req, res) => {
  try {
    const { material, quantity, type, note } = req.body;

    const existingMaterial = await Material.findById(material);
    if (!existingMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Update availableQuantity
    if (type === "inflow") {
      existingMaterial.availableQuantity += quantity;
    } else if (type === "outflow") {
      if (existingMaterial.availableQuantity < quantity) {
        return res.status(400).json({ message: "Insufficient stock for outflow" });
      }
      existingMaterial.availableQuantity -= quantity;
    } else {
      return res.status(400).json({ message: "Invalid inventory type" });
    }

    await existingMaterial.save();

    const newInventory = await Inventory.create({
      material,
      quantity,
      type,
      note,
    });

    res.status(201).json({ message: "Inventory recorded", data: newInventory });
  } catch (err) {
    res.status(500).json({ message: "Error adding inventory", error: err.message });
  }
};

// GET all inventory records
exports.getAllInventory = async (req, res) => {
  try {
    const records = await Inventory.find()
      .populate("material", "name category")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inventory", error: err.message });
  }
};

// GET inventory summary
exports.getInventorySummary = async (req, res) => {
  try {
    const summary = await Inventory.aggregate([
      {
        $group: {
          _id: { material: "$material", type: "$type" },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $group: {
          _id: "$_id.material",
          inflow: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "inflow"] }, "$totalQuantity", 0]
            }
          },
          outflow: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "outflow"] }, "$totalQuantity", 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: "materials",
          localField: "_id",
          foreignField: "_id",
          as: "material"
        }
      },
      {
        $unwind: "$material"
      },
      {
        $project: {
          _id: 0,
          materialId: "$material._id",
          name: "$material.name",
          category: "$material.category",
          inflow: 1,
          outflow: 1
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Error generating summary", error: err.message });
  }
};
