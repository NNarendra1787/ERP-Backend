const mongoose = require("mongoose");

const grnSchema = new mongoose.Schema({
  grnNumber: { type: String, required: true, unique: true },

  purchaseOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PurchaseOrder",
    required: true
  },

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },

  receivedItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      orderedQty: Number,
      receivedQty: Number
    }
  ],

  remarks: { type: String },

  receivedDate: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("GRN", grnSchema);
