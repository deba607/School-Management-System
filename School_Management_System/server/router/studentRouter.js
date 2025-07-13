const express = require('express');
const router = express.Router();
const studentProfileController = require('../controllers/studentController');

// Create
router.post('/', studentProfileController.createStudent);
// Read all
router.get('/', studentProfileController.getProfiles);
// Read one
router.get('/:id', studentProfileController.getProfileById);
// Update
router.put('/:id', studentProfileController.updateProfile_ID);
// // Update by email
// router.put('/email', studentProfileController.updateProfile_Email);
// Delete
router.delete('/:id', studentProfileController.deleteProfile);

module.exports = router;