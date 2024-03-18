import { Request, Response } from 'express';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';

const { deleteImage } = manageImages();
const { cleanUser, deleteUserById, getUserById } = manageUsers();

async function deleteUserController(req: Request, res: Response) {
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
      return res.status(403).json({ message: 'You are not authorized to delete this user' });
    }

    if (user.avatar) {
      await deleteImage(user.avatar.public_id);
    }

    await deleteUserById(userId);

    res.json({ message: 'User removed', data: await cleanUser(user) });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default deleteUserController;
