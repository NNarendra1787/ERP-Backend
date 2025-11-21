const express = require('express');
const customerRouter = express.Router();
const Customer = require("../Models/Customer");
const auth = require("../middleware/authentication")
const permit = require("../middleware/roles");

// ✅ Get all customers
customerRouter.get("/", auth, async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ✅ Add customer (admin or sales)
customerRouter.post("/", auth, permit("admin", "sales"), async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ✅ Update customer
customerRouter.put("/:id", auth, permit("admin", "sales"), async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ✅ Delete customer
customerRouter.delete("/:id", auth, permit("admin"), async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = customerRouter;