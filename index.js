require('dotenv').config();
const express = require('express');
const connectToDB = require("./Config/db");
const cors = require('cors');
const auth = require("./Middleware/authentication")

const app = express();
connectToDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./Routes/auth'));


app.get('/api/me', auth, (req, res)=>{
    res.json(req.user);
});

app.use('/api/products', require("./Routes/Products"));

app.use('/api/customers', require("./Routes/customers"));
app.use("/api/suppliers", require("./Routes/Supliers"))
app.use("/api/sales-orders", require("./Routes/SalesOrders"));
app.use("/api/purchase-orders", require("./Routes/PurchaseOrders"));
app.use('/api/invoices', require('./Routes/Invoices'));
app.use("/api/grn", require("./Routes/GRNRoutes"));
app.use("/api/reports", require("./Routes/Reports"));
app.use("/api/users", require("./Routes/Users"));






const PORT = process.env.PORT || 2002;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));