import { z, ZodError } from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone number is required'),
  message: z.string().min(1, 'Message is required'),
});

export function validateContact(data: unknown) {
  try {
    return { success: true, data: ContactSchema.parse(data) };
  } catch (err) {
    if (err instanceof ZodError) {
      // Use .issues, not .errors
      return { success: false, errors: err.issues };
    }
    throw err;
  }
} 