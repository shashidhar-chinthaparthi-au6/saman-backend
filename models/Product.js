const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category.subCategories',
        required: true
    },
    price: Number,
    description: String,
    offer: String,
    discountPrice: Number,
    quantity: Number,
    availability: Boolean,
    image: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
