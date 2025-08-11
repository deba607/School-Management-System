import { NextFunction, Request, Response } from 'express';
import { ApiResponseUtil } from '@/utils/apiResponse';
import { Logger } from '@/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error('Unhandled error', err);
  return ApiResponseUtil.error('Something went wrong');
};

export const notFoundHandler = (req: Request, res: Response) => {
  return ApiResponseUtil.notFound(`Route ${req.originalUrl} not found`);
};