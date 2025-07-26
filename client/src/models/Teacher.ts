import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  address: string;
  password: string;
  pictures: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  schoolId: mongoose.Schema.Types.ObjectId;
}

const TeacherSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Teacher name is required'],
    trim: true,
    maxlength: [100, 'Teacher name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  otp: { type: String },
  otpExpiry: { type: Date },
  pictures: [{
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    base64Data: { type: String, required: true }
  }],
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
}, {
  timestamps: true
});

export const Teacher = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema); 