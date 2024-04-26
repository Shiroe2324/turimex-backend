import bcrypt from 'bcrypt';
import type { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import logger from '../../managers/logger.manager';
import userManager from '../../managers/user.manager';
import config from '../../utils/config';
import HttpError from '../../utils/HttpError';

const { jwtSecrets } = config;
const { cleanUser, getUserByEmail } = userManager();

async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.body.email as string;
    const password = req.body.password as string;

    const user = await getUserByEmail(email);

    if (!user) {
      const error = new HttpError(401, 'Authentication failed - Invalid credentials');
      return next(error);
    }

    if (!user.isVerified) {
      const error = new HttpError(401, 'Authentication failed - User not verified');
      return next(error);
    }

    if (!user.password) {
      const error = new HttpError(500, 'Server Error - Password not set');
      return next(error);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const error = new HttpError(401, 'Authentication failed - Invalid credentials');
      return next(error);
    }

    const token = JWT.sign({ user: user.userId }, jwtSecrets.login);

    res.json({ token, data: cleanUser(user) });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default loginController;
