import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import manageUsers from '../managers/user.manager';
import config from '../utils/config';

interface UserPayload {
  user: string;
}

const { getUserWithoutPassword } = manageUsers();

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;

    const user = await getUserWithoutPassword(decoded.user);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
}

export default authenticate;
