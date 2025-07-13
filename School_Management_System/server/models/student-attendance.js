const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({}, { strict: false });

const studentAttendance = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  batch: { type: String, required: true },
  attendance: {
    type: Map,
    of: Boolean,
    default: {}
  }
});

module.exports = mongoose.model('Student', studentSchema);