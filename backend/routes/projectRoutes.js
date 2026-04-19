const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createProject, getProjects, deleteProject } = require('../controllers/projectController');

router.route('/').post(protect, createProject).get(protect, getProjects);
router.route('/:id').delete(protect, deleteProject);

module.exports = router;
