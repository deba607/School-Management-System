import { z } from 'zod';

const TeachersignupSchema = z.object({
  profileImage: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  employeeId: z.string().min(1, { message: 'Employee ID is required' }),
  designation: z.string().min(1, { message: 'Designation is required' }),
  department: z.string().min(1, { message: 'Department is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  qualification: z.string().min(1, { message: 'Qualification is required' }),
  specialization: z.string().min(1, { message: 'Specialization is required' }),
  joinDate: z.string().min(1, { message: 'Join Date is required' }), // Optionally add regex for date
  experience: z.coerce.number().min(0, { message: 'Experience is required' }), // <-- CHANGED
  courses: z.array(z.string().min(1, { message: 'Course name is required' })).min(1, { message: 'At least one course is required' }),
  bio: z.string().min(1, { message: 'Bio is required' }),
});

export default { TeachersignupSchema };