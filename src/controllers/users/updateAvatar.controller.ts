import type { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import userManager from '../../managers/user.manager';
import HttpError from '../../utils/HttpError';

const { cleanUser, getUserById, updateUserById } = userManager();
const { uploadImage, deleteImage } = manageImages();

async function updateAvatarController(req: Request, res: Response, next: NextFunction) {
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
      const error = new HttpError(403, 'Access denied - Not authorized to update this avatar');
      return next(error);
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      const error = new HttpError(400, 'Invalid data - No files have been selected.');
      return next(error);
    }

    const avatar = Object.values(req.files)[0];

    if (Array.isArray(avatar)) {
      const error = new HttpError(400, 'Invalid data - Only one file is allowed');
      return next(error);
    }

    if (user.avatar) {
      await deleteImage(user.avatar.public_id);
    }

    const result = await uploadImage(avatar.tempFilePath, 'avatars');
    await fs.unlink(avatar.tempFilePath);

    const newAvatar = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    const userToUpdate = { avatar: newAvatar };
    const updatedUser = await updateUserById(userId, userToUpdate);

    if (!updatedUser) {
      const error = new HttpError(500, 'Server Error - Avatar could not be updated');
      return next(error);
    }

    res.json({ message: 'Avatar updated successfully', data: cleanUser(updatedUser) });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default updateAvatarController;
