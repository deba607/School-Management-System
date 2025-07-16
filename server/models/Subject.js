const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stream: {
    type: String,
    required: true
  },
  sem: {
    type: String,
    required: true
  },
  teacher: {
    // You can store just the teacher's name, email, or reference a Teacher model if you have one
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);