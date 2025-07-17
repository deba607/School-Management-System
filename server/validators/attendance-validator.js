const { z } = require('zod');

const attendanceValidator = z.object({
  studentName: z
    .string({ required_error: 'Student Name is required' })
    .trim()
    .min(2, { message: 'Student Name must be at least 2 characters long' })
    .max(100, { message: 'Student Name must be at most 100 characters long' }),
  studentRoll: z
    .string({ required_error: 'Student Roll is required' })
    .trim()
    .min(1, { message: 'Student Roll is required' })
    .max(30, { message: 'Student Roll must be at most 30 characters long' }),
  subjectName: z
    .string({ required_error: 'Subject Name is required' })
    .trim()
    .min(1, { message: 'Subject Name is required' })
    .max(100, { message: 'Subject Name must be at most 100 characters long' }),
  stream: z
    .string({ required_error: 'Stream is required' })
    .trim()
    .min(1, { message: 'Stream is required' })
    .max(50, { message: 'Stream must be at most 50 characters long' }),
  sem: z
    .string({ required_error: 'Semester is required' })
    .trim()
    .min(1, { message: 'Semester is required' })
    .max(20, { message: 'Semester must be at most 20 characters long' }),
  sec: z
    .string({ required_error: 'Section is required' })
    .trim()
    .min(1, { message: 'Section is required' })
    .max(10, { message: 'Section must be at most 10 characters long' }),
  group: z
    .string({ required_error: 'Group is required' })
    .trim()
    .min(1, { message: 'Group is required' })
    .max(10, { message: 'Group must be at most 10 characters long' }),
  date: z
    .string({ required_error: 'Date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
  teacherName: z
    .string({ required_error: 'Teacher Name is required' })
    .trim()
    .min(2, { message: 'Teacher Name must be at least 2 characters long' })
    .max(100, { message: 'Teacher Name must be at most 100 characters long' }),
  present: z
    .boolean({ required_error: 'Present/Absent is required' })
});

module.exports = { attendanceValidator };