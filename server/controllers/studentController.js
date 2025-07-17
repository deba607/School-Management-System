const { validate } = require('../middlewares/validate-middileware');
const StudentProfile = require('../models/student-profile');
const { signupSchema } = require('../validators/teacher-auth-validator');
const { StudentsignupSchema } = require('../validators/student-validator');

// Create a student
const addStudent = async (req, res) => {
  console.log(addStudent); // Log the request body for debugging
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(422).json({ message: "Email is required" });
    }

    // Check if student already exists by email
    const studentExist = await StudentProfile.findOne({ email });
    if (studentExist) {
      return res.status(409).json({ message: "Email already exists" }); // 409 Conflict is more standard
    }

    // Create student profile with all fields from req.body
    const studentCreated = await StudentProfile.create({ ...req.body });

    // Ensure generateToken exists and works
    let token = null;
    if (typeof studentCreated.generateToken === "function") {
      token = studentCreated.generateToken(); // No need for await if synchronous
    }

    res.status(201).json({
      message: "Registration Successful",
      token,
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

exports.createStudent = [validate(StudentsignupSchema), addStudent];


// Get all profiles
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await StudentProfile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update profile
exports.updateProfile_ID = async (req, res) => {
  try {
    const profile = await StudentProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// // Update profile by email
// exports.updateProfile_Email = async (req, res) => {
//   try {
//     const email = req.params.email;
//     if (!email) return res.status(400).json({ error: 'Email is required' });

//     const profile = await StudentProfile.findOneAndUpdate(
//       { email: email },    // filter by email
//       req.body,            // update data
//       { new: true }
//     );

//     if (!profile) return res.status(404).json({ error: 'Profile not found' });
//     res.json(profile);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// Delete profile
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findByIdAndDelete(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
