import type { NextFunction, Request, Response } from 'express';

import emailManager from '@managers/email.manager';
import logger from '@managers/logger.manager';
import passwordManager from '@managers/password.manager';
import tokenManager from '@managers/token.manager';
import userManager from '@managers/user.manager';
import HttpError from '@utils/HttpError';

const { isSmtpHostDown, sendVerificationEmail } = emailManager();
const { hashPassword } = passwordManager();
const { createToken } = tokenManager();
const { cleanUser, createUser, deleteUserByEmail, getUserByEmail } = userManager();

async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const isSmtpDown = await isSmtpHostDown();

    if (isSmtpDown) {
      const error = new HttpError(500, 'Server Error - Email service is down');
      return next(error);
    }

    const email = (req.body['email'] as string).trim();
    const password = (req.body['password'] as string).trim();
    const username = (req.body['username'] as string).trim();
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      const error = new HttpError(400, 'Invalid data - User with this email already exists');
      return next(error);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await createUser({
      avatar: null,
      email,
      isAdmin: false,
      isVerified: false,
      password: hashedPassword,
      username,
    });

    const token = createToken(newUser, 'validation');
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
