import type { NextFunction, Request, Response } from 'express';

import imageManager from '@managers/image.manager';
import logger from '@managers/logger.manager';
import userManager from '@managers/user.manager';
import HttpError from '@utils/HttpError';

const { deleteImage } = imageManager();
const { cleanUser, deleteUserById, getUserById } = userManager();

async function deleteUserController(req: Request, res: Response, next: NextFunction) {
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
      const error = new HttpError(403, 'Access denied - Not authorized to delete this user');
      return next(error);
    }

    if (user.avatar) {
      await deleteImage(user.avatar.public_id);
    }

    await deleteUserById(userId);

    res.json({ message: 'User removed', data: cleanUser(user) });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default deleteUserController;
