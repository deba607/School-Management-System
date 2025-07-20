import mongoose, { Document, Schema } from 'mongoose';

export interface ISchool extends Document {
  schoolName: string;
  email: string;
  address: string;
  phone: string;
  pictures: string[]; // URLs to uploaded images
  token: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>({
  schoolName: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [100, 'School name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  pictures: [{
    type: String,
    required: false
  }],
  token: {
    type: String,
    required: [true, 'Access token is required'],
    trim: true,
    unique: true,
    minlength: [6, 'Token must be at least 6 characters long']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password; // Don't send password in responses
      return ret;
    }
  }
});

// Create index for better query performance
SchoolSchema.index({ email: 1 });
SchoolSchema.index({ token: 1 });
SchoolSchema.index({ schoolName: 1 });

export const School = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema); 