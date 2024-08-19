const Razorpay = require('razorpay');
const Order = require('../models/Order');
const dotenv = require('dotenv');

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    try {
        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_order_${Math.random().toString(36).substr(2, 9)}`,
            payment_capture: '1'
        };

        const response = await razorpay.orders.create(options);

        const order = await Order.create({
            user: userId,
            razorpayOrderId: response.id,
            amount: amount,
            status: 'Pending'
        });

        res.status(200).json({ success: true, order, response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
