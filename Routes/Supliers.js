const express = require('express');
const suplyRouter = express.Router();
const Supplier = require("../Models/Supplier");
const auth = require("../Middleware/authentication");
const permit = require("../Middleware/roles");

// Get all Suppliers

suplyRouter.get("/", auth, async(req, res)=>{
    try {
        const suppliers = await Supplier.find({});
        res.json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})

// ✅ Add supplier (admin / purchase role)
suplyRouter.post("/", auth, permit("admin", "purchase"), async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json(supplier);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ✅ Update supplier
suplyRouter.put("/:id", auth, permit("admin", "purchase"), async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ✅ Delete supplier
suplyRouter.delete("/:id", auth, permit("admin"), async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = suplyRouter;