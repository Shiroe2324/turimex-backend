import { Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';

const { cleanUser, getUserById, updateUserById } = manageUsers();

async function updateUserController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const { userId } = req.params;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    const userToUpdate = { username: req.body.username as string };
    const updatedUser = await updateUserById(userId, userToUpdate);

    if (!updatedUser) {
      return res.status(500).json({ message: 'User could not be updated' });
    }

    res.json({ message: 'User updated successfully', user: await cleanUser(updatedUser) });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default updateUserController;
