import { Router } from 'express';
import loginController from '../controllers/authentication/login.controller';
import registerController from '../controllers/authentication/register.controller';
import validateFieldsMiddleware from '../middlewares/validateFields.middleware';
import loginValidator from '../validators/authentication/login.validator';
import registerValidator from '../validators/authentication/register.validator';

const router = Router();

router.post('/login', loginValidator, validateFieldsMiddleware, loginController);

router.post('/register', registerValidator, validateFieldsMiddleware, registerController);

export default router;
