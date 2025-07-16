const { validate } = require('../middlewares/validate-middileware');
const TeacherProfile = require('../models/teacher-profile');
const { TeachersignupSchema } = require('../validators/teacher-validator').default;

// GET all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await TeacherProfile.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await TeacherProfile.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: 'TeacherProfile not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE teacher
const addTeacher = async (req, res) => {
  try {
    // Destructure required fields
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(422).json({ message: "Email is required" });
    }

    // Check if teacher already exists by email
    const teacherExist = await TeacherProfile.findOne({ email });
    if (teacherExist) {
      return res.status(409).json({ message: "Email already exists" }); // 409 Conflict is more standard
    }

    // Create teacher profile (all fields from req.body)
    const teacherCreated = await TeacherProfile.create({ ...req.body });

    // Ensure generateToken exists and works
    let token = null;
    if (typeof teacherCreated.generateToken === "function") {
      token = await teacherCreated.generateToken();
    }

    res.status(201).json({
      message: "Registration Successful",
      token,
      teacherId: teacherCreated._id.toString()
    });
  } catch (err) {
    // Return validation errors with 422, others with 500
    if (err.name === "ValidationError") {
      return res.status(422).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};
exports.createTeacher = [validate(TeachersignupSchema), addTeacher];


// UPDATE teacher
exports.updateProfile_ID = async (req, res) => {
  try {
    const profile = await TeacherProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await TeacherProfile.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) return res.status(404).json({ error: 'TeacherProfile not found' });
    res.json({ message: 'TeacherProfile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
