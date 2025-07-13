const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    // Student's Details
    profileImage: { type: String },
    enrollmentNo: { type: String, required: true },
    exam: { type: String, required: true },
    stream: { type: String, required: true },
    rank: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    pin: { type: Number, required: true }, // CHANGED
    state: { type: String, required: true },
    phone: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    website: { type: String, required: true },
    dob: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    passport: { type: String, required: true },
    caste: { type: String, required: true },
    religion: { type: String, required: true },
    // Father's Details
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherDesignation: { type: String, required: true },
    fatherOrgName: { type: String, required: true },
    fatherOrgAddress: { type: String, required: true },
    fatherDistrict: { type: String, required: true },
    fatherAge: { type: Number, required: true }, // CHANGED
    fatherPin: { type: Number, required: true }, // CHANGED
    fatherState: { type: String, required: true },
    fatherPhone: { type: String, required: true },
    fatherMobile: { type: String, required: true },
    fatherEmail: { type: String, required: true },
    fatherWebsite: { type: String, required: true },
    fatherPan: { type: String, required: true },
    fatherVoterId: { type: String, required: true },
    fatherPassport: { type: String, required: true },
    fatherAnnualIncome: { type: Number, required: true }, // CHANGED
    fatherClub: { type: String, required: true },
    // Mother's Details
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherDesignation: { type: String, required: true },
    motherOrgName: { type: String, required: true },
    motherOrgAddress: { type: String, required: true },
    motherDistrict: { type: String, required: true },
    motherAge: { type: Number, required: true }, // CHANGED
    motherPin: { type: Number, required: true }, // CHANGED
    motherState: { type: String, required: true },
    motherPhone: { type: String, required: true },
    motherMobile: { type: String, required: true },
    motherEmail: { type: String, required: true },
    motherWebsite: { type: String, required: true },
    motherPan: { type: String, required: true },
    motherVoterId: { type: String, required: true },
    motherPassport: { type: String, required: true },
    motherAnnualIncome: { type: Number, required: true }, // CHANGED
    motherClub: { type: String, required: true },
    // Local Guardian's Details
    guardianName: { type: String, required: true },
    guardianOccupation: { type: String, required: true },
    guardianDesignation: { type: String, required: true },
    guardianOrgName: { type: String, required: true },
    guardianOrgAddress: { type: String, required: true },
    guardianDistrict: { type: String, required: true },
    guardianAge: { type: Number, required: true }, // CHANGED
    guardianPin: { type: Number, required: true }, // CHANGED
    guardianState: { type: String, required: true },
    guardianPhone: { type: String, required: true },
    guardianMobile: { type: String, required: true },
    guardianEmail: { type: String, required: true },
    guardianWebsite: { type: String, required: true },
    guardianPan: { type: String, required: true },
    guardianVoterId: { type: String, required: true },
    guardianPassport: { type: String, required: true },
    guardianAnnualIncome: { type: Number, required: true }, // CHANGED
    guardianClub: { type: String, required: true },
    guardianSex: { type: String, required: true },
    // Academic Records 10
    tenInstitute: { type: String, required: true },
    tenBoard: { type: String, required: true },
    tenTotalMarks: { type: Number, required: true }, // CHANGED
    tenPercentage: { type: Number, required: true }, // CHANGED
    tenYearPassing: { type: Number, required: true }, // CHANGED
    // Academic Records 10+2
    ten2Institute: { type: String, required: true },
    ten2Board: { type: String, required: true },
    ten2TotalMarks: { type: Number, required: true }, // CHANGED
    ten2YearPassing: { type: Number, required: true }, // CHANGED
    // Subjects
    physicsMarks: { type: Number, required: true }, // CHANGED
    physicsTotal: { type: Number, required: true }, // CHANGED
    chemistryMarks: { type: Number, required: true }, // CHANGED
    chemistryTotal: { type: Number, required: true }, // CHANGED
    mathMarks: { type: Number, required: true }, // CHANGED
    mathTotal: { type: Number, required: true }, // CHANGED
    totalMarks: { type: Number, required: true }, // CHANGED
    totalPercentage: { type: Number, required: true }, // CHANGED
    // isAdmin: { type: Boolean, default: false }, // Uncomment if you want admin flag
}, { timestamps: true });

// json web token
userSchema.methods.generateToken = function() {
    try {
      return jwt.sign({
        userId: this._id.toString(),
        email: this.email,
        // isAdmin: this.isAdmin, // Uncomment if you add isAdmin to schema
      },
      process.env.SECRET_KEY, {
        expiresIn: "30d",
      });
    } catch (err) {
      console.log("Error", err);
    }
};

const Student = mongoose.model("Student", userSchema);
module.exports = Student;