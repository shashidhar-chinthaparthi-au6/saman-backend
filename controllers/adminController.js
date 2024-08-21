const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// SuperAdmin - Create an Admin
exports.createAdmin = async (req, res) => {
    const { name, email, password, region } = req.body;

    try {
        const user = await User.create({ name, email, password, role: 'Admin', region });
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Admin - Add/Update/Delete Products
exports.addProduct = async (req, res) => {
    try {
        const { category, subCategory, price, description, offer, discountPrice, quantity, availability, image,name } = req.body;

        const product = await Product.create({
            category,
            subCategory,
            price,
            description,
            offer,
            discountPrice,
            quantity,
            availability,
            image,
            name
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Admin - Confirm/Cancel Orders
exports.confirmOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        order.status = 'Confirmed';
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
