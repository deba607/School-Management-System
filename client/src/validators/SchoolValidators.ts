import { z } from 'zod';

export const SchoolSchema = z.object({
  schoolName: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(100, 'School name cannot exceed 100 characters')
    .trim(),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters')
    .trim()
    .toLowerCase(),
  
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address cannot exceed 500 characters')
    .trim(),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .trim(),
  
  pictures: z.array(z.string().url('Invalid image URL')).optional(),
  
  token: z.string()
    .min(6, 'Token must be at least 6 characters')
    .max(50, 'Token cannot exceed 50 characters')
    .trim(),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  confirmPassword: z.string()
    .min(8, 'Confirm password must be at least 8 characters')
    .max(100, 'Confirm password cannot exceed 100 characters')
});

export const SchoolUpdateSchema = SchoolSchema.partial().omit({ confirmPassword: true });

export const SchoolLoginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  
  password: z.string()
    .min(1, 'Password is required')
});

export function validateSchool(data: any) {
  try {
    const validatedData = SchoolSchema.parse(data);
    
    // Check if passwords match
    if (validatedData.password !== validatedData.confirmPassword) {
      return {
        success: false,
        errors: ['Passwords do not match']
      };
    }
    
    // Remove confirmPassword from the data before returning
    const { confirmPassword, ...schoolData } = validatedData;
    
    return {
      success: true,
      data: schoolData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(issue => issue.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

export function validateSchoolUpdate(data: any) {
  try {
    const validatedData = SchoolUpdateSchema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(issue => issue.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

export function validateSchoolLogin(data: any) {
  try {
    const validatedData = SchoolLoginSchema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(issue => issue.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
} 