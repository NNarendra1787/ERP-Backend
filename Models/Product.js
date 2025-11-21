const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sku: { type: String, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 5 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
