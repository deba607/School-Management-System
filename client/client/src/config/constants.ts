// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '7d';

// Roles
export const ROLES = {
  ADMIN: 'admin',
  SCHOOL: 'school',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const;

// API Rate Limits
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
};

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred',
} as const;
