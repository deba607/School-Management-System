import { z } from 'zod';
import mongoose from 'mongoose';
import { IStudent } from '@/models/Student';

const PictureSchema = z.object({
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  base64Data: z.string()
});

// Base schema for student input (what comes from the client)
export const StudentInputSchema = z.object({
  name: z.string()
    .min(2, 'Student name must be at least 2 characters')
    .max(100, 'Student name cannot exceed 100 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  class: z.string()
    .min(1, 'Class is required')
    .max(20, 'Class cannot exceed 20 characters')
    .trim(),
  sec: z.string()
    .min(1, 'Section is required')
    .max(10, 'Section cannot exceed 10 characters')
    .trim(),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .trim(),
  schoolId: z.string()
    .min(1, 'School ID is required')
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid school ID format'
    }),
  pictures: z.array(PictureSchema).optional().default([])
});

// Type for the input data
export type StudentInput = z.infer<typeof StudentInputSchema>;

// Type for the database model (extends the input type with Mongoose document fields)
export type StudentDocument = StudentInput & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  otp?: string;
  otpExpiry?: Date;
};

type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationError = {
  success: false;
  errors: z.ZodIssue[];
};

type ValidationResult<T = StudentInput> = ValidationSuccess<T> | ValidationError;

// Define a type for the student input data that doesn't include Mongoose document methods
type StudentInputData = {
  name: string;
  email: string;
  password: string;
  class: string;
  sec: string;
  address: string;
  schoolId: mongoose.Types.ObjectId;
  pictures: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  otp?: string;
  otpExpiry?: Date;
};

// Validation result with proper typing for the data
type StudentValidationResult = ValidationResult<StudentInputData>;

export const validateStudent = (data: unknown): StudentValidationResult => {
  const result = StudentInputSchema.safeParse(data);
  if (!result.success) {
    return { 
      success: false, 
      errors: result.error.issues 
    };
  }
  
  // Create the validated data with proper types
  const validatedData: StudentInputData = {
    ...result.data,
    schoolId: new mongoose.Types.ObjectId(result.data.schoolId),
    pictures: result.data.pictures || []
  };
  
  return { 
    success: true, 
    data: validatedData
  };
};