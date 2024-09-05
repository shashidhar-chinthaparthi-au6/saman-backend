const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming users are required
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
