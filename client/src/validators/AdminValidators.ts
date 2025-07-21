import { z } from 'zod';

// Schema for base64 image data
const PictureSchema = z.object({
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  base64Data: z.string()
});

export const AdminSchema = z.object({
  name: z.string()
    .min(2, 'Admin name must be at least 2 characters')
    .max(100, 'Admin name cannot exceed 100 characters')
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
  
  pictures: z.array(PictureSchema).optional().default([])
});

export const AdminUpdateSchema = AdminSchema.partial();

export function validateAdmin(data: any) {
  try {
    console.log('Validating admin data:', data);
    
    // Ensure all required fields are present
    const requiredFields = ['name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        errors: [`Missing required fields: ${missingFields.join(', ')}`]
      };
    }
    
    const validatedData = AdminSchema.parse(data);
    
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

export function validateAdminUpdate(data: any) {
  try {
    const validatedData = AdminUpdateSchema.parse(data);
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