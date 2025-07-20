import { z } from 'zod';

// Schema for base64 image data
const PictureSchema = z.object({
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  base64Data: z.string()
});

export const SchoolSchema = z.object({
  name: z.string()
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
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address cannot exceed 500 characters')
    .trim(),
  
  phone: z.string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(20, 'Phone number cannot exceed 20 digits')
    .trim(),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City cannot exceed 100 characters')
    .trim(),
  
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State cannot exceed 100 characters')
    .trim(),
  
  zipCode: z.string()
    .min(3, 'ZIP code must be at least 3 characters')
    .max(20, 'ZIP code cannot exceed 20 characters')
    .trim(),
  
  country: z.string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country cannot exceed 100 characters')
    .trim(),
  
  website: z.string().optional().or(z.literal('')),
  
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  
  pictures: z.array(PictureSchema).optional().default([])
});

export const SchoolUpdateSchema = SchoolSchema.partial();

export function validateSchool(data: any) {
  try {
    console.log('Validating data:', data);
    
    // Ensure all required fields are present
    const requiredFields = ['name', 'email', 'address', 'phone', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        errors: [`Missing required fields: ${missingFields.join(', ')}`]
      };
    }
    
    const validatedData = SchoolSchema.parse(data);
    
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    console.error('Validation error:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
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