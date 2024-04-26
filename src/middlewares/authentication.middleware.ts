import type { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import userManager from '../managers/user.manager';
import config from '../utils/config';
import HttpError from '../utils/HttpError';
import errorMiddleware from './error.middleware';

interface UserPayload {
  user: string;
}

const { jwtSecrets } = config;
const { getUserWithoutPassword } = userManager();

async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    const error = new HttpError(401, 'Unauthorized - No token provided');
    return errorMiddleware(error, req, res);
  }

  try {
    const decoded = JWT.verify(token, jwtSecrets.login) as UserPayload;

    const user = await getUserWithoutPassword(decoded.user);

    if (!user) {
      const error = new HttpError(401, 'Unauthorized - Invalid token');
      return errorMiddleware(error, req, res);
    }

    req.user = user;

    next();
  } catch (error) {
    const err = new HttpError(401, 'Unauthorized - Invalid token');
    return errorMiddleware(err, req, res);
  }
}

export default authenticationMiddleware;
