const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// Query routes
router.get('/projects', queryController.getProjectsBySkill);
router.get('/skills/top', queryController.getTopSkills);
router.get('/search', queryController.search);

module.exports = router;