import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  password: string;
  class: string;
  sec: string;
  pictures: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Student name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  sec: {
    type: String,
    required: [true, 'Section is required'],
    trim: true
  },
  pictures: [{
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    base64Data: { type: String, required: true }
  }],
}, {
  timestamps: true
});

StudentSchema.index({ email: 1 });

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema); 