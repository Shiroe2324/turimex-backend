import { Router } from 'express';
import deleteUserController from '../controllers/users/deleteUser.controller';
import getUserController from '../controllers/users/getUser.controller';
import getUsersController from '../controllers/users/getUsers.controller';
import updateAvatarController from '../controllers/users/updateAvatar.controller';
import updateUserController from '../controllers/users/updateUser.controller';
import authenticationMiddleware from '../middlewares/authentication.middleware';
import validateFieldsMiddleware from '../middlewares/validateFields.middleware';
import getUsersValidator from '../validators/users/getUsers.validator';
import updateAvatarValidator from '../validators/users/updateAvatar.validator';
import updateUserValidator from '../validators/users/updateUser.validator';

const router = Router();

router.delete('/:userId', authenticationMiddleware, deleteUserController);

router.get('/:userId', getUserController);

router.get('/', getUsersValidator, validateFieldsMiddleware, getUsersController);

router.put(
  '/:userId/avatar',
  authenticationMiddleware,
  updateAvatarValidator,
  validateFieldsMiddleware,
  updateAvatarController,
);

router.put(
  '/:userId',
  authenticationMiddleware,
  updateUserValidator,
  validateFieldsMiddleware,
  updateUserController,
);

export default router;
