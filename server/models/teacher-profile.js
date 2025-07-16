const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const teacherSchema = new mongoose.Schema({
  profileImage: { type: String },
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  qualification: { type: String, required: true },
  specialization: { type: String, required: true },
  joinDate: { type: String, required: true }, // Store as string (YYYY-MM-DD)
  experience: { type: Number, required: true }, // Number is recommended
  courses: [{ type: String, required: true }],
  bio: { type: String, required: true },
  // isAdmin: { type: Boolean, default: false }, // Uncomment if you want admin flag
});

// json web token
teacherSchema.methods.generateToken = function() {
  try {
    return jwt.sign(
      {
        teacherId: this._id.toString(),
        email: this.email,
        // isAdmin: this.isAdmin, // Uncomment if you add isAdmin to schema
      },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
  } catch (err) {
    console.log("Error", err);
  }
};

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;