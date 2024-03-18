import bcrypt from 'bcrypt';
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

    if (user.userId !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    if (!req.body.password && !req.body.username) {
      return res.status(400).json({ message: 'Password or username is required' });
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
      return res.status(500).json({ message: 'User could not be updated' });
    }

    res.json({ message: 'User updated successfully', data: await cleanUser(updatedUser) });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default updateUserController;
