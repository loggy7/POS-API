const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        id: String,
        name: String,
        quantity: Number,
        price: Number
    }],
    total: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
