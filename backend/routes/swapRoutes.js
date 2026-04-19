const express = require('express');
const router = express.Router();
const SwapRequest = require('../models/SwapRequest');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// @desc    Send a swap request
// @route   POST /api/swaps
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { providerId, message } = req.body;

        // Prevent duplicate pending requests
        const existing = await SwapRequest.findOne({ requester: req.user.id, provider: providerId, status: 'pending' });
        if (existing) {
            return res.status(400).json({ message: 'Swap request already pending.' });
        }

        const swapRequest = await SwapRequest.create({
            requester: req.user.id,
            provider: providerId,
            message
        });

        // Notify provider
        await Notification.create({
            user: providerId,
            title: 'New Skill Swap Request',
            message: `${req.user.name} wants to swap skills with you.`,
            type: 'swap_request'
        });

        res.status(201).json(swapRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's swap requests (both sent and received)
// @route   GET /api/swaps
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const received = await SwapRequest.find({ provider: req.user.id }).populate('requester', 'name department skillsOffered skillsWanted');
        const sent = await SwapRequest.find({ requester: req.user.id }).populate('provider', 'name department skillsOffered skillsWanted');

        res.status(200).json({ received, sent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update swap request status (accept/reject)
// @route   PUT /api/swaps/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        const swapRequest = await SwapRequest.findById(req.params.id);

        if (!swapRequest) return res.status(404).json({ message: 'Request not found' });

        // Ensure only provider can accept/reject
        if (swapRequest.provider.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        swapRequest.status = status;
        await swapRequest.save();

        if (status === 'accepted') {
            await Notification.create({
                user: swapRequest.requester,
                title: 'Swap Request Accepted!',
                message: `${req.user.name} accepted your skill swap request. You can now schedule a session or chat.`,
                type: 'swap_accepted'
            });
        }

        res.status(200).json(swapRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
