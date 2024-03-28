import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';
import config from '../../utils/config';

interface VerificationPayload {
  user: string;
  verification: boolean;
}

const { jwtSecret } = config;
const { cleanUser, getUserById, updateUserById } = manageUsers();

async function verifyEmailController(req: Request, res: Response) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Invalid Data - Token is required' });
    }

    const decoded = jwt.verify(token as string, jwtSecret) as VerificationPayload;

    if (!decoded.verification) {
      return res.status(400).json({ message: 'Invalid Data - Token is not valid' });
    }

    const user = await getUserById(decoded.user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Invalid Data - User already verified' });
    }

    const userToUpdate = { isVerified: true };
    const updatedUser = await updateUserById(user.userId, userToUpdate);

    if (!updatedUser) {
      return res.status(500).json({ message: 'Server Error - User could not be verified' });
    }

    res.json({
      message: 'User verified successfully',
      data: await cleanUser(user),
    });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default verifyEmailController;