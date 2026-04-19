const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

// @desc    Get messages for a specific room
// @route   GET /api/messages/:room
// @access  Private
router.get('/:room', protect, async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
