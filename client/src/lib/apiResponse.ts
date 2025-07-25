import { NextResponse } from 'next/server';

type SuccessResponseOptions = {
  data?: any;
  message?: string;
  status?: number;
  headers?: Record<string, string>;
};

type ErrorResponseOptions = {
  error: string;
  details?: any;
  status?: number;
  code?: string;
};

export const ApiResponse = {
  success: ({
    data = null,
    message = 'Success',
    status = 200,
    headers = {},
  }: SuccessResponseOptions = {}) => {
    const response = NextResponse.json(
      { success: true, data, message },
      { status }
    );

    // Add headers
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  },

  error: ({
    error,
    details,
    status = 400,
    code,
  }: ErrorResponseOptions) => {
    const response: any = { success: false, error };
    
    if (details) response.details = details;
    if (code) response.code = code;
    
    return NextResponse.json(response, { status });
  },

  notFound: (message = 'Resource not found') => {
    return ApiResponse.error({
      error: message,
      status: 404,
      code: 'NOT_FOUND',
    });
  },

  unauthorized: (message = 'Unauthorized') => {
    return ApiResponse.error({
      error: message,
      status: 401,
      code: 'UNAUTHORIZED',
    });
  },

  forbidden: (message = 'Forbidden') => {
    return ApiResponse.error({
      error: message,
      status: 403,
      code: 'FORBIDDEN',
    });
  },

  validationError: (errors: any[]) => {
    return ApiResponse.error({
      error: 'Validation failed',
      details: errors,
      status: 422,
      code: 'VALIDATION_ERROR',
    });
  },

  rateLimitExceeded: () => {
    return ApiResponse.error({
      error: 'Too many requests, please try again later',
      status: 429,
      code: 'RATE_LIMIT_EXCEEDED',
    });
  },

  serverError: (error?: any) => {
    console.error('Server Error:', error);
    return ApiResponse.error({
      error: 'An unexpected error occurred',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
    });
  },
};
