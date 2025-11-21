// const express = require('express');
// const InvoiceRouter = express.Router();
// const Invoice = require('../Models/Invoice');
// const SalesOrder = require('../Models/SalesOrder');
// const auth = require('../middleware/authentication');
// const permit = require('../middleware/roles');

// // helper to create a simple invoice number
// const makeInvoiceNumber = async () => {
//   const count = await Invoice.countDocuments();
//   const d = new Date();
//   const datePart = d.toISOString().slice(0,10).replace(/-/g,'');
//   return `INV-${datePart}-${String(count+1).padStart(4,'0')}`;
// };

// // Create invoice from a sales order id
// InvoiceRouter.post('/from-sales-order/:soId', auth, permit('admin','sales'), async (req, res) => {
//   try {
//     const soId = req.params.soId;
//     const so = await SalesOrder.findById(soId).populate('customer').populate('items.product');
//     if (!so) return res.status(404).json({ message: 'SalesOrder not found' });

//     // build invoice items (snapshot)
//     const items = so.items.map(it => ({
//       product: it.product?._id || null,
//       name: it.product?.title || it.product?.name || 'Product',
//       quantity: it.quantity,
//       price: it.price,
//       total: it.total
//     }));

//     const subtotal = items.reduce((s, i) => s + (i.total || 0), 0);
//     const tax = req.body.tax || 0; // allow tax from client or default 0
//     const grandTotal = subtotal + tax;

//     const invoiceNumber = await makeInvoiceNumber();

//     const invoice = new Invoice({
//       salesOrder: so._id,
//       customer: so.customer?._id,
//       items,
//       subtotal,
//       tax,
//       grandTotal,
//       invoiceNumber
//     });

//     await invoice.save();

//     res.json(invoice);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // Get all invoices
// InvoiceRouter.get('/', auth, async (req, res) => {
//   try {
//     const invoices = await Invoice.find({}).populate('customer').populate('salesOrder');
//     res.json(invoices);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

// // Get invoice by id
// InvoiceRouter.get('/:id', auth, async (req, res) => {
//   try {
//     const inv = await Invoice.findById(req.params.id).populate('customer').populate('salesOrder');
//     if (!inv) return res.status(404).json({ message: 'Invoice not found' });
//     res.json(inv);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

// module.exports = InvoiceRouter;


const express = require("express");
const InvoiceRouter = express.Router();
const Invoice = require("../Models/Invoice");
const SalesOrder = require("../Models/SalesOrder");
const auth = require("../Middleware/authentication");
const permit = require("../Middleware/roles");

const makeInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  const d = new Date();
  const date = d.toISOString().slice(0,10).replace(/-/g,"");
  return `INV-${date}-${String(count+1).padStart(4,'0')}`;
};

InvoiceRouter.post("/from-sales-order/:id", auth, permit("admin","sales"), async (req, res) => {
  try {
    const so = await SalesOrder.findById(req.params.id)
      .populate("customer")
      .populate("items.product");

    if(!so) return res.status(404).json({ message: "Sales order not found" });

    const items = so.items.map((i) => ({
      product: i.product?._id,
      name: i.product?.title,
      quantity: i.quantity,
      price: i.price,
      total: i.total
    }));

    const subtotal = items.reduce((a,b) => a + b.total, 0);
    const tax = req.body.tax || 0;
    const grandTotal = subtotal + tax;
    const invoiceNumber = await makeInvoiceNumber();

    const invoice = new Invoice({
      salesOrder: so._id,
      customer: so.customer?._id,
      items,
      subtotal,
      tax,
      grandTotal,
      invoiceNumber
    });

    await invoice.save();

    res.json(invoice);
  }
  catch(err){ 
    console.log(err);
    res.status(500).send("Server error");
  }
});

InvoiceRouter.get("/", auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({})
      .populate("customer")
      .populate("salesOrder");
    res.json(invoices);
  } catch(err){
    res.status(500).send("Server error");
  }
});

InvoiceRouter.get("/:id", auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer")
      .populate("salesOrder");
    res.json(invoice);
  }
  catch(err){
    res.status(500).send("Server error");
  }
});

module.exports = InvoiceRouter;
