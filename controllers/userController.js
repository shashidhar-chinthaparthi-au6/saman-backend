const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// Get Products by Category with Random Image

exports.getProductsByCategory = async (req, res) => {
    try {
        // Fetch distinct categories from the Product collection
        const categories = await Product.distinct("category");

        // Attach random Loremflickr image to each category
        const categoriesWithImages = categories.map(category => ({
            name: category,
            image: `https://loremflickr.com/320/240/${encodeURIComponent(category)}`
        }));

        // Return the list of categories with images
        res.status(200).json({ success: true, categories: categoriesWithImages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Products by SubCategory with Image
exports.getProductsBySubCategory = async (req, res) => {
    const { subCategory } = req.params;

    try {
        const products = await Product.find({ subCategory });

        // Attach image for the subcategory
        products.forEach(product => {
            product.image = `https://via.placeholder.com/150?text=${encodeURIComponent(product.subCategory)}`;
        });

        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Product Details
exports.getProductDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.image = `https://via.placeholder.com/150?text=${encodeURIComponent(product.subCategory)}`;
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Add to Cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        console.log("User:", user);
        console.log("Product ID:", productId);

        // Initialize cart if undefined
        user.cart = user.cart || [];

        // Check if product is already in the cart
        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
    const { cartId } = req.params;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        // Filter out the item with the given cartId
        user.cart = user.cart.filter(item => item.product.toString() !== cartId);
        await user.save();

        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fetch Cart Summary
exports.fetchCartSummary = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch user and populate the cart items' products
        const user = await User.findById(userId).populate('cart.product');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Create cart summary
        const cartSummary = user.cart.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalPrice: item.quantity * (item.product ? item.product.price : 0), // Ensure product exists
        }));

        // Send response
        res.status(200).json({ success: true, cartSummary });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, error: error.message });
    }
};

// Checkout
exports.checkout = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('cart.product');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const total = user.cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        const order = await Order.create({
            user: userId,
            items: user.cart,
            total,
            status: 'Pending'
        });

        // Clear the user's cart after checkout
        user.cart = [];
        await user.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
