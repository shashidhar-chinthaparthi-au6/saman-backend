const express = require('express');
const {
    createAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductDetails,
    addToCart,
    removeFromCart,
    checkout,
    confirmOrder,
    cancelOrder,
    fetchCart,  // Added route for fetching the cart
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// SuperAdmin
router.post('/admin/create', protect, authorize('SuperAdmin'), createAdmin);

// Admin
router.post('/product', protect, authorize('Admin'), addProduct);
router.put('/product/:id', protect, authorize('Admin'), updateProduct);
router.delete('/product/:id', protect, authorize('Admin'), deleteProduct);

// User
router.get('/products', getProducts);
router.get('/products/:id', getProductDetails);
router.get('/cart', protect, authorize('User'), fetchCart);  // Fetch cart route
router.post('/cart', protect, authorize('User'), addToCart);
router.delete('/cart/:cartId', protect, authorize('User'), removeFromCart);
router.post('/checkout', protect, authorize('User'), checkout);

// Admin - Order management
router.put('/order/confirm/:id', protect, authorize('Admin'), confirmOrder);
router.put('/order/cancel/:id', protect, authorize('Admin'), cancelOrder);

module.exports = router;
