import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';
import config from '../../utils/config';

const { getUserByEmail, createUser, cleanUser } = manageUsers();

async function registerController(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ user: newUser._id.toString() }, config.jwtSecret, {
      expiresIn: '24h',
    });

    res.status(201).json({
      token,
      user: await cleanUser(newUser),
    });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default registerController;