import type { NextFunction, Request, Response } from 'express';

import logger from '@managers/logger.manager';
import userManager from '@managers/user.manager';
import HttpError from '@utils/HttpError';

const { getUserWithoutPassword } = userManager();

async function getUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const user = await getUserWithoutPassword(userId);

    if (!user) {
      const error = new HttpError(404, 'User not found');
      return next(error);
    }

    res.json({ data: user });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default getUserController;
