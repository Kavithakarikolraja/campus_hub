const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' } // MongoDB TTL index to delete after 7 days
});

module.exports = mongoose.model('Message', messageSchema);
