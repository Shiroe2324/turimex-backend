import { Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';

const { getUserWithoutPassword } = manageUsers();

async function getUserController(req: Request, res: Response) {
  try {
    const user = await getUserWithoutPassword(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default getUserController;