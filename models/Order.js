const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cart: [{ type: Schema.Types.ObjectId, ref: 'CartItem', required: true }],
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true }, // e.g., 'credit_card', 'paypal'
  status: { type: String, default: 'pending' }, // e.g., 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
