const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      price: Number,
      total: Number,
    }
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  invoiceDate: { type: Date, default: Date.now },
  invoiceNumber: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
