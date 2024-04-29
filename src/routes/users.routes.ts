import { Router } from 'express';

import deleteUserController from '@controllers/deleteUser.controller';
import getUserController from '@controllers/getUser.controller';
import getUsersController from '@controllers/getUsers.controller';
import updateUserController from '@controllers/updateUser.controller';
import updateUserAvatarController from '@controllers/updateUserAvatar.controller';
import authenticationMiddleware from '@middlewares/authentication.middleware';
import rateLimitMiddleware from '@middlewares/rateLimit.middleware';
import validateFieldsMiddleware from '@middlewares/validateFields.middleware';
import getUsersValidator from '@validators/getUsers.validator';
import updateAvatarValidator from '@validators/updateAvatar.validator';
import updateUserValidator from '@validators/updateUser.validator';

const router = Router();

router.delete(
  '/:userId',
  rateLimitMiddleware(1, 3),
  authenticationMiddleware,
  deleteUserController,
);

router.get('/:userId', rateLimitMiddleware(1, 30), getUserController);

router.get(
  '/',
  rateLimitMiddleware(1, 30),
  getUsersValidator,
  validateFieldsMiddleware,
  getUsersController,
);

router.patch(
  '/:userId/avatar',
  rateLimitMiddleware(1, 1),
  authenticationMiddleware,
  updateAvatarValidator,
  validateFieldsMiddleware,
  updateUserAvatarController,
);

router.put(
  '/:userId',
  rateLimitMiddleware(1, 3),
  authenticationMiddleware,
  updateUserValidator,
  validateFieldsMiddleware,
  updateUserController,
);

export default router;
