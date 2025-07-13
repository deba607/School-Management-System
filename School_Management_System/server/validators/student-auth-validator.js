const { z } = require('zod');

const signSchema = z.object({
  name: z
    .string({required_error: 'Name is required'})
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(255, { message: 'Name must be at most 20 characters long' }),
  email: z
    .string({required_error: 'Email is required'})
    .trim()
    .email({ message: 'Invalid email address' })
    .min(3, { message: 'Email must be at least 3 characters long' })
    .max(255, { message: 'Email must be at most 255 characters long' }),
  phone: z
    .string({required_error: 'Phone number is required'})
    .trim()
    .min(10, { message: 'Phone number must be at least 10 characters long' })
    .max(15, { message: 'Phone number must be at most 15 characters long' }),
  gender: z
    .string({required_error: 'gender is required'})
    .trim(),

  stream: z
    .string({required_error: 'stream is required'})
    .trim(),
  batch: z
    .string({required_error: 'batch is required'})
    .trim(),
  password: z
    .string({required_error: 'Password is required'})
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(16, { message: 'Password must be at most 16 characters long' }),
  confirmPassword: z
    .string({required_error: 'ConfirmPassword is required'})
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(16, { message: 'Password must be at most 16 characters long' }),
});

module.exports = { signSchema };