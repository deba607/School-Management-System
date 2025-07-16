const Student = require('../models/student-registration');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtpEmail = require('../utils/sendOtpEmail');

const OTP_SECRET = 'your-very-secure-secret'; // Use env variable in production

// 1. Send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const student = await Student.findOne({ email });
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Sign a JWT containing the OTP and expiry
  const otpToken = jwt.sign(
    { email, otp, otpExpires },
    OTP_SECRET,
    { expiresIn: '10m' }
  );

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent', otpToken }); // Send token to frontend
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// 2. Verify OTP
exports.verifyOtp = async (req, res) => {
  console.log(req.body); // Log the request body for debugging
  const { email, otp, otpToken } = req.body;
  if (!email || !otp || !otpToken)
    return res.status(400).json({ message: 'Email, OTP, and token are required.' });

  try {
    const payload = jwt.verify(otpToken, OTP_SECRET);
    if (payload.email !== email)
      return res.status(400).json({ message: 'Invalid token for this email.' });
    if (payload.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP.' });
    if (Date.now() > payload.otpExpires)
      return res.status(400).json({ message: 'OTP expired.' });

    // Mark as verified in frontend (or issue a new token for password reset)
    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const student = await Student.findOne({ email: normalizedEmail });
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const saltRound = await bcrypt.genSalt(10);
  const hash_password = await bcrypt.hash(newPassword, saltRound);
  student.password = hash_password;
  // Only set confirmPassword if your schema requires it; otherwise, remove this line:
  student.confirmPassword = hash_password;
  await student.save();

  res.json({ message: 'Password reset successful' });
};