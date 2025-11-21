const express = require("express");
const SOrderRoute = express.Router();
const SalesOrder = require("../Models/SalesOrder")
const auth = require("../middleware/authentication");
const permit = require("../middleware/roles");

// Get all Sales Orders
SOrderRoute.get("/", auth, async (req, res) => {
  try {
    const orders = await SalesOrder.find({})
      .populate("customer")
      .populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Create Sales Order
SOrderRoute.post("/", auth, permit("admin", "sales"), async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items found" });
    }

    // Calculate totals
    let subtotal = 0;
    items.forEach((item) => {
      item.total = item.quantity * item.price;
      subtotal += item.total;
    });

    const grandTotal = subtotal;

    const order = new SalesOrder({
      customer,
      items,
      subtotal,
      grandTotal,
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// Delete Sales Order
SOrderRoute.delete("/:id", auth, permit("admin"), async (req, res) => {
  try {
    await SalesOrder.findByIdAndDelete(req.params.id);
    res.json({ message: "Sales Order Deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = SOrderRoute;
