const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceStudentController');

router.post('/', attendanceController.enrollStudent);
router.put('/:id', attendanceController.updateStudent);
router.get('/', attendanceController.getAllStudent);

module.exports = router;