import { Request, Response } from 'express';
import fs from 'fs-extra';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';

const { cleanUser, getUserById, updateUserById } = manageUsers();
const { uploadImage, deleteImage } = manageImages();

async function updateAvatarController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const { userId } = req.params;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.userId !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied - You are not authorized to update this avatar' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'Invalid data - No files have been selected.' });
    }

    const avatar = Object.values(req.files)[0];

    if (Array.isArray(avatar)) {
      return res.status(400).json({ message: 'Invalid data - Only one file is allowed' });
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
      return res.status(500).json({ message: 'Avatar could not be updated' });
    }

    res.json({ message: 'Avatar updated successfully', data: await cleanUser(updatedUser) });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default updateAvatarController;
