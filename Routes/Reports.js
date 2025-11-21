const express = require("express");
const ReportRouters = express.Router();

const SalesOrder = require("../Models/SalesOrder");
const PurchaseOrder = require("../Models/PurchaseOrder");
const auth = require("../Middleware/authentication");
const permit = require("../Middleware/roles");

// Sales Report
ReportRouters.get("/sales", auth, permit("admin", "sales"), async (req, res) => {
  try {
    const { from, to, customer } = req.query;

    let filter = {};

    if (from && to) {
      filter.orderDate = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }

    if (customer) {
      filter.customer = customer;
    }

    const sales = await SalesOrder.find(filter)
      .populate("customer");

    res.json(sales);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating sales report");
  }
});
// Purchase Report
ReportRouters.get("/purchase", auth, permit("admin", "purchase"), async (req, res) => {
  try {
    const { from, to, supplier } = req.query;

    let filter = {};

    if (from && to) {
      filter.orderDate = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }

    if (supplier) {
      filter.supplier = supplier;
    }

    const purchaseOrders = await PurchaseOrder.find(filter)
      .populate("supplier");

    res.json(purchaseOrders);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating purchase report");
  }
});


module.exports = ReportRouters;
