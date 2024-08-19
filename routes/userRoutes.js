const express = require('express');
const {
    createAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductDetails,  // Import the new controller function
    addToCart,
    removeFromCart,
    checkout,
    confirmOrder,
    cancelOrder,
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
router.get('/products/:id', getProductDetails);  // New route for product details
router.post('/cart', protect, authorize('User'), addToCart);
router.delete('/cart/:productId', protect, authorize('User'), removeFromCart);
router.post('/checkout', protect, authorize('User'), checkout);

// Admin - Order management
router.put('/order/confirm/:id', protect, authorize('Admin'), confirmOrder);
router.put('/order/cancel/:id', protect, authorize('Admin'), cancelOrder);

module.exports = router;
