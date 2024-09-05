const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderActivityLogSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  activity: { type: String, required: true }, // e.g., 'created', 'shipped', 'delivered'
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('OrderActivityLog', OrderActivityLogSchema);
