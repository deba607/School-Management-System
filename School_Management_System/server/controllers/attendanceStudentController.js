const { validate } = require('../middlewares/validate-middileware');
const attendanceStudent = require('../models/attendanceStudent');
const { attendanceStudentSchema } = require('../validators/attendance-student-validator');

// Create new attendanceStudent (Enroll)
// Controller to enroll a new student for attendanceStudent
const enrollStudent0 = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(422).json({ message: "Email is required" });
    }

    // Check if student already exists by email
    const studentExist = await attendanceStudent.findOne({ email });
    if (studentExist) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create student with all fields from req.body
    const studentCreated = await attendanceStudent.create({ ...req.body });

    res.status(201).json({
      message: "Enrollment Successful",
      studentId: studentCreated._id.toString()
    });
  } catch (err) {
    // Return validation errors with 422, others with 500
    if (err.name === "ValidationError") {
      return res.status(422).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.enrollStudent = [validate(attendanceStudentSchema), enrollStudent0];


// Update attendanceStudent
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await attendanceStudent.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'attendanceStudent not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all attendanceStudent records
exports.getAllStudent = async (req, res) => {
  try {
    const records = await attendanceStudent.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};