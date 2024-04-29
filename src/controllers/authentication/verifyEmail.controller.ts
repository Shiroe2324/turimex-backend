import type { NextFunction, Request, Response } from 'express';

import logger from '@managers/logger.manager';
import tokenManager from '@managers/token.manager';
import userManager from '@managers/user.manager';
import HttpError from '@utils/HttpError';

const { verifyToken } = tokenManager();
const { cleanUser, getUserById, updateUserById } = userManager();

async function verifyEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;

    if (!token) {
      const error = new HttpError(400, 'Invalid Data - Token is required');
      return next(error);
    }

    const userIdDecoded = verifyToken(token, 'validation');
    const user = await getUserById(userIdDecoded);

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
