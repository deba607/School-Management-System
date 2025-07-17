const nodemailer = require('nodemailer');

const sendOtpEmail = async (to, otp) => {
  // Use your real SMTP config here
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'debanjanpaul609@gmail.com',      // Replace with your email
      pass: 'mloz beur iefw jbax',       // Replace with your app password
    },
  });

  await transporter.sendMail({
    from: 'your@email.com',
    to,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`
  });
};

module.exports = sendOtpEmail;