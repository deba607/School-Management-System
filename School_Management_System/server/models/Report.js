const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  stream: { type: String, required: true },
  year: { type: String, required: true },
  sem: { type: String, required: true },
  sec: { type: String, required: true },
  group: { type: String, required: true },
  docType: { type: String, required: true }, // ca1, ca2, etc.
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // or 'Completed'
  remarks: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);