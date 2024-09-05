const Product = require('../models/Product');
const Cart = require('../models/CartItem');
const Order = require('../models/Order');

// Fetch available products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;  // Ensure these fields are provided in the request body
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'User and Product are required.' });
    }

    const cartItem = new Cart({ user: userId, product: productId, quantity });
    await cartItem.save();
    res.status(201).json({ success: true, data: cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const cartItem = await Cart.findByIdAndUpdate(cartItemId, { quantity }, { new: true });
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error });
  }
};

// Get cart details for a specific user
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.find({ user: req.user.id }).populate('product');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};


// Get order summary for a specific user
exports.getOrderSummary = async (req, res) => {
    try {
        const cart = await Cart.find({ user: req.user.id }).populate('product');
        const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
        res.status(200).json({ cart, totalAmount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order summary', error });
    }
};

// Confirm order
exports.confirmOrder = async (req, res) => {
  try {
    const { userId, cart, deliveryAddress, paymentMethod,totalAmount } = req.body;
    const order = await Order.create({ userId, cart, deliveryAddress, paymentMethod,status:'confim', totalAmount });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error confirming order', error });
  }
};

// Checkout
exports.checkout = async (req, res) => {
    try {
      const { orderId, paymentMethod, paymentDetails } = req.body;
  
      // Fetch the order by orderId
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the payment method is "cash_on_delivery"
      if (paymentMethod === 'cash_on_delivery') {
        // Handle cash on delivery
        order.status = 'confirmed';
        await order.save();
  
        res.status(200).json({ message: 'Order confirmed for Cash on Delivery', order });
      } else {
        // Handle other payment methods (e.g., credit card, PayPal)
        if (!paymentDetails) {
          return res.status(400).json({ message: 'Payment details required for non-COD methods' });
        }
  
        // Integrate with your payment gateway here
        // Assume payment processing is successful for now
  
        order.status = 'confirmed';
        await order.save();
  
        res.status(200).json({ message: 'Payment successful, Order confirmed', order });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error during checkout', error });
    }
  };
  

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error });
  }
};

// Get order confirmation
exports.getOrderConfirmation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order confirmation', error });
  }
};

// Get all orders for a user
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get activity log of an order
exports.getOrderActivityLog = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity log', error });
  }
};

// Get order history for a user
exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId, status: { $in: ['delivered', 'cancelled'] } });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history', error });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(orderId, { status: 'cancelled' }, { new: true });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error });
  }
};

// Get cancellation reasons
exports.getCancellationReasons = (req, res) => {
  const reasons = ['Product out of stock', 'Delay in delivery', 'Changed mind'];
  res.status(200).json(reasons);
};

// Submit cancellation reason
exports.submitCancellationReason = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { cancellationReason: reason }, { new: true });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting cancellation reason', error });
  }
};
