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
    const { category, subCategory, price, description, offer, discountPrice, quantity, availability } = req.body;

    try {
        const product = await Product.create({ category, subCategory, price, description, offer, discountPrice, quantity, availability });
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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

// User - Browse and Search Products
exports.getProducts = async (req, res) => {
    const { category, search } = req.query;

    try {
        let query = {};
        if (category) query.category = category;
        if (search) query.$text = { $search: search };

        const products = await Product.find(query);
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// User - Add/Remove Items from Cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        user.cart.push({ product: productId, quantity });
        await user.save();

        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();

        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// User - Checkout and Order
exports.checkout = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('cart.product');
        const total = user.cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        const order = await Order.create({ user: userId, items: user.cart, total, status: 'Pending' });
        user.cart = [];
        await user.save();

        res.status(200).json({ success: true, order });
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

exports.getProductDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

