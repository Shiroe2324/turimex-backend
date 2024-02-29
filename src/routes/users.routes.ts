import { Router } from 'express';
import deleteUserController from '../controllers/users/deleteUser.controller';
import getUserController from '../controllers/users/getUser.controller';
import getUsersController from '../controllers/users/getUsers.controller';
import updateAvatarController from '../controllers/users/updateAvatar.controller';
import authenticate from '../middlewares/authentication';
import validateFields from '../middlewares/validateFields';
import getUsersValidator from '../validators/users/getUsers.validator';
import updateAvatarValidator from '../validators/users/updateAvatar.validator';

const router = Router();

router.delete('/:id', authenticate, deleteUserController);

router.get('/:id', getUserController);

router.get('/', authenticate, getUsersValidator, validateFields, getUsersController);

router.put(
  '/:id/avatar',
  authenticate,
  updateAvatarValidator,
  validateFields,
  updateAvatarController,
);

export default router;
