import { Router } from 'express';
import loginController from '../controllers/authentication/login.controller';
import registerController from '../controllers/authentication/register.controller';
import validateFields from '../middlewares/validateFields';
import loginValidator from '../validators/authentication/login.validator';
import registerValidator from '../validators/authentication/register.validator';

const router = Router();

router.post('/login', loginValidator, validateFields, loginController);

router.post('/register', registerValidator, validateFields, registerController);

export default router;
