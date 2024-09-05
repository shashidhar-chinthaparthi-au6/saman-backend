const express = require('express');
const router = express.Router();
const { 
    addToCart,
    cancelOrder,
    checkout,
    confirmOrder,
    confirmPayment,
    getAllOrders,
    getCancellationReasons,
    getCart,
    getOrderActivityLog,
    getOrderConfirmation,
    getOrderHistory,
    getOrderSummary,
    getProducts,
    submitCancellationReason,
    updateCartItem 
} = require('../controllers/orderController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Product Selection and Cart Management
router.get('/products', getProducts);

// Protect and authorize cart routes
router.use(protect);  // Apply protect middleware to all routes below

router.post('/cart', addToCart);
router.put('/cart/:cartItemId', updateCartItem);
router.get('/cart', getCart);

// Order Summary, Confirmation, and Checkout
router.get('/summary', getOrderSummary);
router.post('/confirm', confirmOrder);
router.post('/payment/checkout', checkout);
router.post('/payment/confirm', confirmPayment);
router.get('/confirmation/:orderId', getOrderConfirmation);

// Order History, Activity Log, and Management
router.get('/orders', getAllOrders);
router.get('/orders/activity-log/:orderId', getOrderActivityLog);
router.get('/orders/history', getOrderHistory);

// Order Cancellation
router.post('/cancel/:orderId', cancelOrder);
router.get('/order/cancellation-reasons', getCancellationReasons);
router.post('/order/cancel/:orderId/reason', submitCancellationReason);

module.exports = router;
