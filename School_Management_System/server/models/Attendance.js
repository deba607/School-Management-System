const mongoose = require('mongoose');

// Helper to format date as YYYY-MM-DD
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const Attendance = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  studentRoll: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    required: true
  },
  sem: {
    type: String,
    required: true
  },
  sec: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: getCurrentDate, // Automatically set to today's date
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  present: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', Attendance);