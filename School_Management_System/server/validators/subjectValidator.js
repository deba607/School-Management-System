const { z } = require('zod');

const subjectValidator = z.object({
  name: z.string().min(1, 'Name is required'),
  stream: z.string().min(1, 'Stream is required'),
  sem: z.string().min(1, 'Semester is required'),
  teacher: z.string().min(1, 'Teacher is required')
});

module.exports = subjectValidator;