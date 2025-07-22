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
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  pictures: z.array(PictureSchema).optional().default([])
});

export function validateTeacher(data: any) {
  // Only validate password, not confirmPassword
  const result = TeacherSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
} 