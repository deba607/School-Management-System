import { z } from 'zod';

const PictureSchema = z.object({
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  base64Data: z.string()
});

export const StudentSchema = z.object({
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
  schoolId: z.string().min(6, 'School ID is required'),
  pictures: z.array(PictureSchema).optional().default([])
});

export function validateStudent(data: any) {
  const result = StudentSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error.issues };
  }
} 