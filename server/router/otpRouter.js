const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// Student OTP
router.post('/student-auth/send-otp', otpController.sendStudentOtp);
router.post('/student-auth/verify-otp', otpController.verifyStudentOtp);

// Teacher OTP (optional, duplicate logic)
router.post('/teacher-auth/send-otp', otpController.sendTeacherOtp);
router.post('/teacher-auth/verify-otp', otpController.verifyTeacherOtp);

module.exports = router;