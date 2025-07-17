const Teacher = require('../models/teacher-registration'); // Update to your actual teacher model path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtpEmail = require('../utils/sendOtpEmail');

const OTP_SECRET = 'your-very-secure-secret'; // Use env variable in production

// 1. Send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const teacher = await Teacher.findOne({ email });
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

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

// 3. Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const teacher = await Teacher.findOne({ email });
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

  const hashed = await bcrypt.hash(newPassword, 10);
  teacher.password = hashed;
  teacher.confirmPassword = hashed; // Assuming you want to set confirmPassword as well
  await teacher.save();

  res.json({ message: 'Password reset successful' });
};