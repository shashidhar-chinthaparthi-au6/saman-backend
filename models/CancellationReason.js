const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CancellationReasonSchema = new Schema({
  reason: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CancellationReason', CancellationReasonSchema);
