import { Request, Response } from 'express';
import manageImages from '../../managers/image.manager';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';

const { deleteImage } = manageImages();
const { getUserById, deleteUser, cleanUser } = manageUsers();

async function deleteUserController(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this user' });
    }

    if (user.avatar) {
      await deleteImage(user.avatar.public_id);
    }

    await deleteUser(userId);

    res.json({ message: 'User removed', user: await cleanUser(user) });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default deleteUserController;
