const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
}, { timestamps: true });

module.exports = mongoose.model('OrderHistory', OrderHistorySchema);
