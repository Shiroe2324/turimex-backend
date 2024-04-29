import { Router } from 'express';

import loginController from '@controllers/login.controller';
import registerController from '@controllers/register.controller';
import verifyEmailController from '@controllers/verifyEmail.controller';
import rateLimitMiddleware from '@middlewares/rateLimit.middleware';
import validateFieldsMiddleware from '@middlewares/validateFields.middleware';
import loginValidator from '@validators/login.validator';
import registerValidator from '@validators/register.validator';
import verifyEmailValidator from '@validators/verifyEmail.validator';

const router = Router();

router.post(
  '/login',
  rateLimitMiddleware(1, 5),
  loginValidator,
  validateFieldsMiddleware,
  loginController,
);

router.post(
  '/register',
  rateLimitMiddleware(1, 5),
  registerValidator,
  validateFieldsMiddleware,
  registerController,
);

router.patch(
  '/verify-email',
  rateLimitMiddleware(1, 1),
  verifyEmailValidator,
  validateFieldsMiddleware,
  verifyEmailController,
);

export default router;
