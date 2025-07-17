const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// POST /api/attendance - Create attendance record
router.post('/', attendanceController.createAttendance);

// GET /api/attendance - Get all attendance records
router.get('/', attendanceController.getAttendance);

// Fetch attendance records with filters
router.get('/params', attendanceController.getAttendanceRecords);

module.exports = router;