const Attendance = require('../models/Attendance');
const { attendanceValidator } = require('../validators/attendance-validator');

// Create new attendance records (bulk insert)
exports.createAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;
    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ message: 'Attendance array is required' });
    }

    // Validate each attendance record using Zod
    const validatedRecords = [];
    for (const record of attendance) {
      try {
        validatedRecords.push(attendanceValidator.parse(record));
      } catch (err) {
        // Return validation errors for the first invalid record
        return res.status(400).json({ message: 'Validation failed', errors: err.errors, invalidRecord: record });
      }
    }

    // Bulk insert
    const inserted = await Attendance.insertMany(validatedRecords);
    res.status(201).json({ message: 'Attendance recorded successfully', attendance: inserted });
  } catch (err) {
    console.error('Error creating attendance:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Get all attendance records (with optional filters)
exports.getAttendance = async (req, res) => {
  try {
    // You can add filters here if needed
    const attendance = await Attendance.find();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance.' });
  }
};


exports.getAttendanceRecords = async (req, res) => {
  try {
    const {
      stream = 'all',
      sem = 'all',
      sec = 'all',
      group = 'all',
      subject = 'all',
      date
    } = req.query;

    // Build dynamic filter object
    const filter = {};
    if (stream !== 'all') filter.stream = stream;
    if (sem !== 'all') filter.sem = sem;
    if (sec !== 'all') filter.sec = sec;
    if (group !== 'all') filter.group = group;
    if (subject !== 'all') filter.subjectName = subject;
    if (date) filter.date = date;

    const attendance = await Attendance.find(filter).lean();

    res.status(200).json(attendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error' });
  }
};