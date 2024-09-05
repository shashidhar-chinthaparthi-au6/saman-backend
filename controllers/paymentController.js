const Razorpay = require('razorpay');
const Order = require('../models/Order');
const dotenv = require('dotenv');
const Cart = require('../models/CartItem');
const User = require('../models/User');

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id; // Get the user ID from the token

    try {
        // Find the user and their cart items
        const user = await User.findById(userId).populate('cart.product');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prepare order items
        const orderItems = user.cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price, // Assuming price is a field in Product model
        }));

        // Create the order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount: amount,
        });

        // Clear the user's cart
        user.cart = [];
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
            order.status = 'Paid';
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;
            await order.save();

            res.status(200).json({ success: true, order });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
      // Fetch orders for the authenticated user
      const orders = await Order.find({ user: req.user.id })
        .populate('user', 'name email') // Fetch user details
        .populate('items.product', 'name price'); // Fetch product details
  
      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };