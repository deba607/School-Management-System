import { z } from 'zod';

export const ResultStudentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  marks: z.string().min(1),
  grade: z.string().min(1),
});

export const ResultSchema = z.object({
  className: z.string().min(1),
  section: z.string().min(1),
  subject: z.string().min(1),
  teacher: z.string().min(1),
  date: z.string().min(1),
  students: z.array(ResultStudentSchema).min(1),
});

export function validateResult(data: any) {
  const result = ResultSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? null : result.error.flatten().fieldErrors,
  };
} 