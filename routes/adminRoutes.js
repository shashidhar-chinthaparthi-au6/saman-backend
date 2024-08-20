const express = require('express');
const {
    createAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    confirmOrder,
    cancelOrder,
} = require('../controllers/adminController'); // Updated to use a separate controller
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// SuperAdmin
router.post('/admin/create', protect, authorize('SuperAdmin'), createAdmin);

// Admin
router.post('/product', protect, authorize('Admin'), addProduct);
router.put('/product/:id', protect, authorize('Admin'), updateProduct);
router.delete('/product/:id', protect, authorize('Admin'), deleteProduct);

// Admin - Order management
router.put('/order/confirm/:id', protect, authorize('Admin'), confirmOrder);
router.put('/order/cancel/:id', protect, authorize('Admin'), cancelOrder);

module.exports = router;
