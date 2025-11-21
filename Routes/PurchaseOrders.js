const express = require("express");
const POrderRouter = express.Router();

const PurchaseOrder = require("../Models/PurchaseOrder");
const Product = require("../Models/Product");
const auth = require("../Middleware/authentication");
const permit = require("../Middleware/roles");

// GET all Purchase Orders
POrderRouter.get("/", auth, async (req, res) => {
  try {
    const orders = await PurchaseOrder.find({})
      .populate("supplier")
      .populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// CREATE Purchase Order
POrderRouter.post("/", auth, permit("admin", "purchase"), async (req, res) => {
  try {
    const { supplier, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items found" });
    }

    // Calculate totals
    let subtotal = 0;
    items.forEach((i) => {
      i.total = i.quantity * i.price;
      subtotal += i.total;
    });

    const grandTotal = subtotal;

    // SAVE PO
    const order = new PurchaseOrder({
      supplier,
      items,
      subtotal,
      grandTotal,
    });

    await order.save();

    // 🔥 OPTION A — Update Stock Immediately
    for (const i of items) {
      await Product.findByIdAndUpdate(i.product, {
        $inc: { stock: i.quantity },
      });
    }

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = POrderRouter;
