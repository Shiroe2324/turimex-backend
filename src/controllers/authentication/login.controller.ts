import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';
import config from '../../utils/config';

const { jwtSecret } = config;
const { cleanUser, getUserByEmail } = manageUsers();

async function loginController(req: Request, res: Response) {
  try {
    const email = req.body.email as string;
    const password = req.body.password as string;

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed - Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed - Invalid credentials' });
    }

    const token = jwt.sign({ user: user.userId }, jwtSecret);

    res.json({ token, data: await cleanUser(user) });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default loginController;
