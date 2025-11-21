const mongoose = require("mongoose");

const salesOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],

    subtotal: { type: Number, required: true },
    grandTotal: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalesOrder", salesOrderSchema);
