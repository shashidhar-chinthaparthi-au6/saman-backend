const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    offer: { type: String },
    discountPrice: { type: Number },
    quantity: { type: Number, required: true },
    availability: { type: Boolean, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
