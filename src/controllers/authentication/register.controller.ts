import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';
import config from '../../utils/config';

const { jwtSecret } = config;
const { cleanUser, createUser, getUserByEmail } = manageUsers();

async function registerController(req: Request, res: Response) {
  try {
    const email = (req.body.email as string).trim();
    const password = (req.body.password as string).trim();
    const username = (req.body.username as string).trim();

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      email,
      password: hashedPassword,
      username,
    });

    // const token = jwt.sign({ user: newUser.userId }, jwtSecret);

    res.status(201).json({
      message: 'User registered successfully',
      data: await cleanUser(newUser),
    });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default registerController;
