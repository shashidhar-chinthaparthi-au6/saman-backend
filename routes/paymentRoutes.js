const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// User - Create an order for payment
router.post('/create-order', protect, authorize('User'), createOrder);

// Verify payment from Razorpay
router.post('/verify-payment', protect, authorize('User'), verifyPayment);

module.exports = router;
