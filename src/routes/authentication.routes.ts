import { Router } from 'express';
import loginController from '../controllers/authentication/login.controller';
import registerController from '../controllers/authentication/register.controller';
import validateFieldsMiddleware from '../middlewares/validateFields.middleware';
import loginValidator from '../validators/authentication/login.validator';
import registerValidator from '../validators/authentication/register.validator';
import { strictLimiterMiddleware } from '../middlewares/limiter.middleware';
import verifyEmailController from '../controllers/authentication/verifyEmail.controller';
import verifyEmailValidator from '../validators/authentication/verifyEmail.validator';

const router = Router();

router.post(
  '/login',
  strictLimiterMiddleware,
  loginValidator,
  validateFieldsMiddleware,
  loginController,
);

router.post(
  '/register',
  strictLimiterMiddleware,
  registerValidator,
  validateFieldsMiddleware,
  registerController,
);

router.put(
  '/verify-email',
  strictLimiterMiddleware,
  verifyEmailValidator,
  validateFieldsMiddleware,
  verifyEmailController,
);

export default router;
