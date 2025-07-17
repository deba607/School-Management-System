const nodemailer = require('nodemailer');

// In-memory store for OTPs (use Redis or DB in production)
const otpStore = {};

// Email setup (use env vars in prod)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'debanjanpaul609@gmail.com',      // Replace with your email
    pass: 'mloz beur iefw jbax',       // Replace with your app password
  }
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generic send OTP function
async function sendOtp(email, userType, res) {
  if (!email) return res.status(400).json({ message: 'Email required' });
  const otp = generateOtp();
  const key = `${userType}:${email}`;
  otpStore[key] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: '"TIEM" <your_email@gmail.com>',
      to: email,
      subject: 'Your OTP for Email Verification',
      text: `Your OTP is: ${otp}`,
      html: `<b>Your OTP is: ${otp}</b>`,
    });
    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
}

// Generic verify OTP function
function verifyOtp(email, otp, userType, res) {
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
  const key = `${userType}:${email}`;
  const record = otpStore[key];
  if (!record) return res.status(400).json({ message: 'No OTP sent to this email' });
  if (Date.now() > record.expires) return res.status(400).json({ message: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  delete otpStore[key];
  res.json({ message: 'OTP verified' });
}

// Student handlers
exports.sendStudentOtp = (req, res) => {
  const { email } = req.body;
  sendOtp(email, 'student', res);
};

exports.verifyStudentOtp = (req, res) => {
  const { email, otp } = req.body;
  verifyOtp(email, otp, 'student', res);
};

// Teacher handlers
exports.sendTeacherOtp = (req, res) => {
  const { email } = req.body;
  sendOtp(email, 'teacher', res);
};

exports.verifyTeacherOtp = (req, res) => {
  const { email, otp } = req.body;
  verifyOtp(email, otp, 'teacher', res);
};