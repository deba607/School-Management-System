import { z } from 'zod';

export const AttendanceStudentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(['Present', 'Absent', 'Late']),
});

export const AttendanceSchema = z.object({
  className: z.string().min(1),
  section: z.string().min(1),
  subject: z.string().min(1),
  teacher: z.string().min(1),
  date: z.string().min(1),
  students: z.array(AttendanceStudentSchema).min(1),
  schoolId: z.string().min(1),
});

export function validateAttendance(data: any) {
  const result = AttendanceSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? null : result.error.flatten().fieldErrors,
  };
}