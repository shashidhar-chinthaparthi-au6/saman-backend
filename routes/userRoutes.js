const express = require('express');
const {
    getProductsByCategory,
    getProductsBySubCategory,
    getProductDetails,
    addToCart,
    removeFromCart,
    fetchCartSummary,
    checkout,
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// User - Browse and Search Products
router.get('/products', getProductsByCategory);
router.get('/products/subcategory/:subCategory', getProductsBySubCategory);
router.get('/products/:id', getProductDetails);

// User - Cart Management
router.get('/cart', protect, authorize('User'), fetchCartSummary);
router.post('/cart', protect, authorize('User'), addToCart);
router.delete('/cart/:cartId', protect, authorize('User'), removeFromCart);

// User - Checkout
router.post('/checkout', protect, authorize('User'), checkout);

module.exports = router;
