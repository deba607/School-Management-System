import { z } from 'zod';

export const ClassScheduleSchema = z.object({
  className: z.string().min(1, 'Class name is required'),
  section: z.string().min(1, 'Section is required'),
  subject: z.string().min(1, 'Subject is required'),
  teacher: z.string().min(1, 'Teacher is required'),
  day: z.array(z.string()).min(1, 'At least one day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  description: z.string().optional(),
  schoolId: z.string().optional(), // Make it optional since we'll add it in the API
});

export function validateClassSchedule(data: any) {
  const result = ClassScheduleSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? null : result.error.flatten().fieldErrors,
  };
}