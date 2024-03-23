import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';
import config from '../../utils/config';
import sendVerificationEmail, { isSmtpHostDown } from '../../utils/email';

const { jwtSecret } = config;
const { cleanUser, createUser, deleteUserByEmail, getUserByEmail } = manageUsers();

async function registerController(req: Request, res: Response) {
  try {
    if (isSmtpHostDown()) {
      return res.status(500).json({ message: 'Server Error - Email service is down' });
    }

    const email = (req.body.email as string).trim();
    const password = (req.body.password as string).trim();
    const username = (req.body.username as string).trim();

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: 'Invalid data - User with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      email,
      password: hashedPassword,
      username,
    });

    const token = jwt.sign({ user: newUser.userId, verification: true }, jwtSecret, {
      expiresIn: '4h',
    });

    const mail = await sendVerificationEmail(email, username, token);

    if (!mail.accepted.length) {
      await deleteUserByEmail(email);
      return res.status(500).json({ message: 'Server Error - Email not sent' });
    }

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
