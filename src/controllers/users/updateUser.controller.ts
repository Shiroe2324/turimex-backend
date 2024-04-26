import bcrypt from 'bcrypt';
import type { NextFunction, Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import userManager from '../../managers/user.manager';
import HttpError from '../../utils/HttpError';

const { cleanUser, getUserById, updateUserById } = userManager();

async function updateUserController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      const error = new HttpError(401, 'Unauthorized - No token provided');
      return next(error);
    }

    const { userId } = req.params;
    const user = await getUserById(userId);

    if (!user) {
      const error = new HttpError(404, 'User not found');
      return next(error);
    }

    if (user.userId !== req.user.userId && !req.user.isAdmin) {
      const error = new HttpError(403, 'Access denied - Not authorized to update this user');
      return next(error);
    }

    if (!req.body.password && !req.body.username) {
      const error = new HttpError(400, 'Invalid data - Password or username is required');
      return next(error);
    }

    let password = user.password;
    let username = user.username;

    if (req.body.password) {
      password = await bcrypt.hash(req.body.password.trim(), 10);
    }

    if (req.body.username) {
      username = req.body.username.trim();
    }

    const userToUpdate = { username, password };
    const updatedUser = await updateUserById(userId, userToUpdate);

    if (!updatedUser) {
      const error = new HttpError(500, 'Server Error - User could not be updated');
      return next(error);
    }

    res.json({ message: 'User updated successfully', data: cleanUser(updatedUser) });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default updateUserController;
