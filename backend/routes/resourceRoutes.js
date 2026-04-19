const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const Resource = require('../models/Resource');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const resources = await Resource.find().populate('uploadedBy', 'name');
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Upload a new resource
// @route   POST /api/resources
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const newResource = await Resource.create({
            title: req.body.title,
            description: req.body.description,
            fileUrl: `/uploads/${req.file.filename}`,
            fileType: req.file.mimetype,
            uploadedBy: req.user.id
        });

        const populatedResource = await Resource.findById(newResource._id).populate('uploadedBy', 'name');

        res.status(201).json(populatedResource);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
