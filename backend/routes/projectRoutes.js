const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.route('/:id')
  .put(protect, admin, updateProject);

module.exports = router;
