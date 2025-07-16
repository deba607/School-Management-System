const mongoose = require('mongoose');

const attendanceStudent = new mongoose.Schema({
  name: { type: String, required: true },
   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  rollNo: { type: String, required: true },
  stream: { type: String, required: true },
  year: { type: String, required: true },
  sem: { type: String, required: true },
  sec: { type: String, required: true },
  group: { type: String, required: true },
});

module.exports = mongoose.model('Attendance_Student', attendanceStudent);