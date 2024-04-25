import bcrypt from 'bcrypt';
import type { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';
import config from '../../utils/config';
import sendVerificationEmail, { isSmtpHostDown } from '../../utils/email';
import HttpError from '../../utils/HttpError';

const { jwtSecrets } = config;
const { cleanUser, createUser, deleteUserByEmail, getUserByEmail } = manageUsers();

async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    if (isSmtpHostDown()) {
      const error = new HttpError(500, 'Server Error - Email service is down');
      return next(error);
    }

    const email = (req.body.email as string).trim();
    const password = (req.body.password as string).trim();
    const username = (req.body.username as string).trim();

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      const error = new HttpError(400, 'Invalid data - User with this email already exists');
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      avatar: null,
      email,
      isAdmin: false,
      isVerified: false,
      password: hashedPassword,
      username,
    });

    const token = JWT.sign({ user: newUser.userId }, jwtSecrets.validation, {
      expiresIn: '4h',
    });

    const mail = await sendVerificationEmail(email, username, token);

    if (!mail.accepted.length) {
      await deleteUserByEmail(email);
      const error = new HttpError(500, 'Server Error - Email not sent');
      return next(error);
    }

    res.status(201).json({
      message: 'User registered successfully',
      data: cleanUser(newUser),
    });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default registerController;
