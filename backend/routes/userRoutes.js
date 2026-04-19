const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    getAllUsers,
    getMatches,
    searchUsers,
    getLeaderboard,
    rateUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, getAllUsers);
router.get('/matches', protect, getMatches);
router.get('/search', protect, searchUsers);
router.get('/leaderboard', protect, getLeaderboard);
router.post('/:id/rate', protect, rateUser);

module.exports = router;
