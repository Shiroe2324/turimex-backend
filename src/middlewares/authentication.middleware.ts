import type { NextFunction, Request, Response } from 'express';

import tokenManager from '@managers/token.manager';
import userManager from '@managers/user.manager';
import errorMiddleware from '@middlewares/error.middleware';
import HttpError from '@utils/HttpError';

const { verifyToken } = tokenManager();
const { getUserWithoutPassword } = userManager();

async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    const error = new HttpError(401, 'Unauthorized - No token provided');
    return errorMiddleware(error, req, res, next);
  }

  try {
    const userIdDecoded = verifyToken(token, 'login');
    const user = await getUserWithoutPassword(userIdDecoded);

    if (!user) {
      const error = new HttpError(401, 'Unauthorized - Invalid token');
      return errorMiddleware(error, req, res, next);
    }

    req.user = user;

    next();
  } catch (error) {
    const err = new HttpError(401, 'Unauthorized - Invalid token');
    return errorMiddleware(err, req, res, next);
  }
}

export default authenticationMiddleware;
