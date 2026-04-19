const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Schedule a new learning session
// @route   POST /api/sessions
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { providerId, date, time, duration, link, projectId } = req.body;

        const session = await Session.create({
            requester: req.user.id,
            provider: providerId,
            date,
            time,
            duration,
            link,
            project: projectId || null
        });

        // Notify the provider
        await Notification.create({
            user: providerId,
            title: 'New Session Scheduled',
            message: `${req.user.name} scheduled a session with you on ${new Date(date).toLocaleDateString()} at ${time}.`,
            type: 'session_scheduled'
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's sessions (both as requester and provider)
// @route   GET /api/sessions
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [{ requester: req.user.id }, { provider: req.user.id }]
        }).populate('requester provider', 'name department').populate('project', 'title').sort('date');

        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a review for a session
// @route   POST /api/sessions/:id/review
// @access  Private
router.post('/:id/review', protect, async (req, res) => {
    try {
        const { rating, feedback, revieweeId } = req.body;
        const sessionId = req.params.id;

        // Ensure session exists
        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        // Ensure duplicate review doesn't exist for this specific session by this user
        const alreadyReviewed = await Review.findOne({ reviewer: req.user.id, session: sessionId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this session' });
        }

        const review = await Review.create({
            reviewer: req.user.id,
            reviewee: revieweeId,
            session: sessionId,
            rating,
            feedback
        });

        // Update the average rating for the user
        const newTotalReviews = (await Review.countDocuments({ reviewee: revieweeId })) || 1;

        // Calculate the exact new average
        const allReviews = await Review.find({ reviewee: revieweeId });
        const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const newAverage = sum / newTotalReviews;

        await User.findByIdAndUpdate(revieweeId, {
            totalReviews: newTotalReviews,
            averageRating: newAverage.toFixed(1) // Keep to 1 decimal place like 4.5
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
