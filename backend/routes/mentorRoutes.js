const express = require('express');
const router = express.Router();
const multer = require('multer');
const { submitCredential, getPendingCredentials, updateCredentialStatus, getMyCredentials } = require('../controllers/mentorController');
const { protect, admin } = require('../middleware/authMiddleware');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.route('/')
    .post(protect, upload.single('certificateFile'), submitCredential)
    .get(protect, getMyCredentials);

router.route('/admin').get(protect, admin, getPendingCredentials);
router.route('/:id').put(protect, admin, updateCredentialStatus);

module.exports = router;
