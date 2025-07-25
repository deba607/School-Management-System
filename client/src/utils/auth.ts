import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  userId?: string;
  schoolId?: string;
  school?: {
    _id: string;
  };
  school_id?: string;
  role?: string;
  // Add other token fields as needed
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getSchoolIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.schoolId || decoded.school?._id || decoded.school_id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getCurrentUser = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
