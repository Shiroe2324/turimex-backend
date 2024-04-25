import type { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/HttpError';

async function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      status: 'error',
      statusCode: error.status,
      message: error.message,
    });
  }

  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal Server Error',
  });
}

export default errorMiddleware;
