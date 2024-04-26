import type { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import logger from '../../managers/logger.manager';
import userManager from '../../managers/user.manager';
import config from '../../utils/config';
import HttpError from '../../utils/HttpError';

interface VerificationPayload {
  user: string;
}

const { jwtSecrets } = config;
const { cleanUser, getUserById, updateUserById } = userManager();

async function verifyEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;

    if (!token) {
      const error = new HttpError(400, 'Invalid Data - Token is required');
      return next(error);
    }

    const decoded = JWT.verify(token as string, jwtSecrets.validation) as VerificationPayload;
    const user = await getUserById(decoded.user);

    if (!user) {
      const error = new HttpError(404, 'User not found');
      return next(error);
    }

    if (user.isVerified) {
      const error = new HttpError(400, 'Invalid Data - User already verified');
      return next(error);
    }

    const userToUpdate = { isVerified: true };
    const updatedUser = await updateUserById(user.userId, userToUpdate);

    if (!updatedUser) {
      const error = new HttpError(500, 'Server Error - User could not be verified');
      return next(error);
    }

    res.json({
      message: 'User verified successfully',
      data: cleanUser(user),
    });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default verifyEmailController;
