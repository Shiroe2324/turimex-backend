import { Router } from 'express';
import deleteUserController from '../controllers/users/deleteUser.controller';
import getUserController from '../controllers/users/getUser.controller';
import getUsersController from '../controllers/users/getUsers.controller';
import updateAvatarController from '../controllers/users/updateAvatar.controller';
import updateUserController from '../controllers/users/updateUser.controller';
import authenticate from '../middlewares/authentication';
import validateFields from '../middlewares/validateFields';
import getUsersValidator from '../validators/users/getUsers.validator';
import updateAvatarValidator from '../validators/users/updateAvatar.validator';
import updateUserValidator from '../validators/users/updateUser.validator';

const router = Router();

router.delete('/:userId', authenticate, deleteUserController);

router.get('/:userId', getUserController);

router.get('/', authenticate, getUsersValidator, validateFields, getUsersController);

router.put(
  '/:userId/avatar',
  authenticate,
  updateAvatarValidator,
  validateFields,
  updateAvatarController,
);

router.put('/:userId', authenticate, updateUserValidator, validateFields, updateUserController);

export default router;
