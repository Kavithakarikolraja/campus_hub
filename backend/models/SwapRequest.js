const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
