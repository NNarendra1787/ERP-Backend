const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        companyName : {type: String},
        email: {type: String},
        phone: {type: String},
        address: {type: String},
        gstNumber: {type: String},
    },
    {timestamps: true}
)

module.exports = mongoose.model("Customer", customerSchema);

