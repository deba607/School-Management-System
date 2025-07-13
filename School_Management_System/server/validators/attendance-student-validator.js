const { z } = require('zod');

const attendanceStudentSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(100, { message: 'Name must be at most 100 characters long' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be at most 255 characters long' }),
  rollNo: z
    .string({ required_error: 'Roll No is required' })
    .trim()
    .min(1, { message: 'Roll No is required' })
    .max(30, { message: 'Roll No must be at most 30 characters long' }),
  stream: z
    .string({ required_error: 'Stream is required' })
    .trim()
    .min(1, { message: 'Stream is required' })
    .max(50, { message: 'Stream must be at most 50 characters long' }),
  year: z
    .string({ required_error: 'Year is required' })
    .trim(),
  sem: z
    .string({ required_error: 'Semester is required' })
    .trim(),
  sec: z
    .string({ required_error: 'Section is required' })
    .trim(),
  group: z
    .string({ required_error: 'Group is required' })
    .trim()
});

module.exports = { attendanceStudentSchema };