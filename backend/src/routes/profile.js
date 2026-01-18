const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Profile CRUD routes
router.post('/profile', profileController.createProfile);
router.get('/profile', profileController.getAllProfiles);
router.get('/profile/:id', profileController.getProfileById);
router.put('/profile/:id', profileController.updateProfile);
router.delete('/profile/:id', profileController.deleteProfile);

module.exports = router;