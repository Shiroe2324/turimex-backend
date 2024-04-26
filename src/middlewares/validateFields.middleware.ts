import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

function validateFieldsMiddleware(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation Error', errors: errors.array() });
  }

  next();
}

export default validateFieldsMiddleware;
