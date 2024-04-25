import type { NextFunction, Request, Response } from 'express';
import logger from '../../managers/logger.manager';
import manageUsers from '../../managers/user.manager';

const { countUsers, getPagenizedUsers } = manageUsers();

async function getUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getPagenizedUsers(req);
    const total = await countUsers();
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    res.json({
      data: users,
      page,
      pageSize,
      total,
    });
  } catch (error: unknown) {
    logger.error(error);
    next();
  }
}

export default getUsersController;
