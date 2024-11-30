import { type Request, type Response, type NextFunction } from 'express';
import { CustomError } from '../utils/customError';

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
