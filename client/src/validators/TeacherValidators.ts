import { z } from 'zod';

const PictureSchema = z.object({
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  base64Data: z.string()
});

export const TeacherSchema = z.object({
  name: z.string()
    .min(2, 'Teacher name must be at least 2 characters')
    .max(100, 'Teacher name cannot exceed 100 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters')
    .trim()
    .toLowerCase(),
  phone: z.string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(20, 'Phone number cannot exceed 20 digits')
    .trim(),
  subject: z.string()
    .min(2, 'Subject must be at least 2 characters')
    .max(100, 'Subject cannot exceed 100 characters')
    .trim(),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  schoolId: z.string().min(1, 'School ID is required'),
  pictures: z.array(PictureSchema).optional().default([])
});

type ValidationSuccess = {
  success: true;
  data: z.infer<typeof TeacherSchema>;
};

type ValidationError = {
  success: false;
  errors: z.ZodIssue[];
};

type ValidationResult = ValidationSuccess | ValidationError;

export function validateTeacher(data: unknown): ValidationResult {
  const result = TeacherSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.issues 
    };
  }
}