const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, department, skillsOffered, skillsWanted } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Safe parse skills
        let parsedOffered = [];
        let parsedWanted = [];
        try {
            if (skillsOffered) parsedOffered = typeof skillsOffered === 'string' ? JSON.parse(skillsOffered) : skillsOffered;
            if (skillsWanted) parsedWanted = typeof skillsWanted === 'string' ? JSON.parse(skillsWanted) : skillsWanted;
        } catch (e) {
            console.error("Error parsing skills during registration");
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            department,
            skillsOffered: parsedOffered,
            skillsWanted: parsedWanted,
            points: 10 // Give 10 initial points for signing up!
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                department: user.department,
                skillsOffered: user.skillsOffered,
                skillsWanted: user.skillsWanted,
                role: user.role,
                isVerifiedMentor: user.isVerifiedMentor,
                points: user.points,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                department: user.department,
                skillsOffered: user.skillsOffered,
                skillsWanted: user.skillsWanted,
                role: user.role,
                isVerifiedMentor: user.isVerifiedMentor,
                points: user.points,
                githubUsername: user.githubUsername,
                linkedinUrl: user.linkedinUrl,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile data
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.name !== undefined) user.name = req.body.name;
        if (req.body.department !== undefined) user.department = req.body.department;

        if (req.body.skillsOffered !== undefined) {
            user.skillsOffered = typeof req.body.skillsOffered === 'string' ? JSON.parse(req.body.skillsOffered) : req.body.skillsOffered;
        }
        if (req.body.skillsWanted !== undefined) {
            user.skillsWanted = typeof req.body.skillsWanted === 'string' ? JSON.parse(req.body.skillsWanted) : req.body.skillsWanted;
        }

        if (req.body.githubUsername !== undefined) user.githubUsername = req.body.githubUsername;
        if (req.body.linkedinUrl !== undefined) user.linkedinUrl = req.body.linkedinUrl;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            department: updatedUser.department,
            skillsOffered: updatedUser.skillsOffered,
            skillsWanted: updatedUser.skillsWanted,
            role: updatedUser.role,
            isVerifiedMentor: updatedUser.isVerifiedMentor,
            githubUsername: updatedUser.githubUsername,
            linkedinUrl: updatedUser.linkedinUrl,
            points: updatedUser.points,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users for Chat list
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get matches for the current user
// @route   GET /api/users/matches
// @access  Private
const getMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const offeredNames = currentUser.skillsOffered.map(s => s.name.toLowerCase());
        const wantedNames = currentUser.skillsWanted.map(s => s.name.toLowerCase());

        // Find users who offer what current user wants, AND want what current user offers
        // To be simpler, we will just find ANY mutual match (at least 1 overlapping skill)
        const allUsers = await User.find({ _id: { $ne: currentUser._id } }).select('-password');

        const matches = allUsers.filter(u => {
            const uOffered = u.skillsOffered.map(s => s.name.toLowerCase());
            const uWanted = u.skillsWanted.map(s => s.name.toLowerCase());

            const theyOfferWhatIWant = uOffered.some(skill => wantedNames.includes(skill));
            const theyWantWhatIOffer = uWanted.some(skill => offeredNames.includes(skill));

            return theyOfferWhatIWant || theyWantWhatIOffer;
        });

        // Fallback: If no direct algorithmic matches exist, just show all other registered users 
        // as general "Network Suggestions" so the feed is never artificially empty when real users exist!
        if (matches.length === 0 && allUsers.length > 0) {
            return res.status(200).json(allUsers);
        }

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search for users by skill, category, etc.
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query; // e.g. /api/users/search?query=react
        if (!query) return res.status(200).json([]);

        const regex = new RegExp(query, 'i');

        const users = await User.find({
            _id: { $ne: req.user.id },
            $or: [
                { name: regex },
                { 'skillsOffered.name': regex },
                { 'skillsOffered.category': regex }
            ]
        }).select('-password');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get top 10 ranked users based on rating and requests/reviews
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find({ role: { $ne: 'admin' } })
            .sort({ averageRating: -1, totalReviews: -1, points: -1 })
            .limit(10)
            .select('-password');
        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Rate a user directly
// @route   POST /api/users/:id/rate
// @access  Private
const rateUser = async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        const revieweeId = req.params.id;

        const Review = require('../models/Review'); // lazy load

        // We pass the reviewer id as a mock Session ID to bypass the schema requirement for manual rating injection
        const review = await Review.create({
            reviewer: req.user.id,
            reviewee: revieweeId,
            session: req.user.id,
            rating: Number(rating),
            feedback: feedback || ''
        });

        // Update the average rating for the target user
        const newTotalReviews = await Review.countDocuments({ reviewee: revieweeId });
        const allReviews = await Review.find({ reviewee: revieweeId });
        const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const newAverage = sum / (newTotalReviews || 1);

        await User.findByIdAndUpdate(revieweeId, {
            totalReviews: newTotalReviews,
            averageRating: newAverage.toFixed(1)
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    getAllUsers,
    getMatches,
    searchUsers,
    getLeaderboard,
    rateUser
};
