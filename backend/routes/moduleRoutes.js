const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Mock data for modules (For the Hub)
const modulesData = {
    technical: [
        { id: 1, title: 'Learn React Core', reward: 50, description: 'Master components and hooks.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
        { id: 2, title: 'Node.js Basics', reward: 40, description: 'Learn server-side JS.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' }
    ],
    communication: [
        { id: 1, title: 'Presentation Skills', reward: 30, description: 'How to present effectively.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop' }
    ],
    aptitude: [
        { id: 1, title: 'Logical Reasoning Test', reward: 100, description: 'Test your logic skills with brain-teasers.', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop' },
        { id: 2, title: 'Quantitative Analytics', reward: 120, description: 'Speed math and data analysis.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop' }
    ],
    integration: [
        { id: 1, title: 'Cross-Department Project', reward: 200, description: 'Collaborate with peers.', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop' }
    ]
};

// @desc    Get all module categories
// @route   GET /api/modules
// @access  Private
router.get('/', protect, (req, res) => {
    res.json(modulesData);
});

module.exports = router;
