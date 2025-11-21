const express = require('express');
const router = express.Router();
const Product = require("../Models/Product")
const auth = require('../Middleware/authentication');
const permit = require('../Middleware/roles');

// GET /api/products
router.get('/', auth, async (req,res) => {
  const products = await Product.find().limit(100);
  res.json(products);
});

// POST /api/products (admin or inventory)
router.post('/', auth, permit('admin','inventory'), async (req,res) => {
  const { title, sku, price, stock, reorderLevel } = req.body;
  const p = new Product({ title, sku, price, stock, reorderLevel });
  await p.save();
  res.json(p);
});

module.exports = router;
