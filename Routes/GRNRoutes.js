const express = require("express");
const grnRoutes = express.Router();

const GRN = require("../Models/GRN");
const PurchaseOrder = require("../Models/PurchaseOrder");
const Product = require("../Models/Product");

const auth = require("../Middleware/authentication");
const permit = require("../Middleware/roles");

// Generate GRN number
const makeGRNNumber = async () => {
  const count = await GRN.countDocuments();
  return `GRN-${String(count + 1).padStart(4, "0")}`;
};

// Create GRN
grnRoutes.post("/", auth, permit("admin", "inventory"), async (req, res) => {
  try {
    const { purchaseOrderId, receivedItems, remarks } = req.body;

    const po = await PurchaseOrder.findById(purchaseOrderId)
      .populate("supplier")
      .populate("items.product");

    if (!po) return res.status(404).json({ message: "Purchase Order not found" });

    // Create GRN Number
    const grnNumber = await makeGRNNumber();

    // Update stock based on received quantity
    for (let item of receivedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.receivedQty }
      });
    }

    const grn = new GRN({
      grnNumber,
      purchaseOrder: po._id,
      supplier: po.supplier._id,
      receivedItems: receivedItems.map((i) => ({
        product: i.product,
        name: i.name,
        orderedQty: i.orderedQty,
        receivedQty: i.receivedQty
      })),
      remarks
    });

    await grn.save();
    res.json(grn);

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// GRN List
grnRoutes.get("/", auth, async (req, res) => {
  const grns = await GRN.find({})
    .populate("supplier")
    .populate("purchaseOrder");
  res.json(grns);
});

module.exports = grnRoutes;
