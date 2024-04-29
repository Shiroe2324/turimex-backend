import { Router } from 'express';

import createProductController from '@controllers/createProduct.controller';
import deleteProductController from '@controllers/deleteProduct.controller';
import getProductController from '@controllers/getProduct.controller';
import getProductsController from '@controllers/getProducts.controller';
import updateProductController from '@controllers/updateProduct.controller';
import updateProductRatingController from '@controllers/updateProductRating.controller';
import authenticationMiddleware from '@middlewares/authentication.middleware';
import rateLimitMiddleware from '@middlewares/rateLimit.middleware';
import validateFieldsMiddleware from '@middlewares/validateFields.middleware';
import createProductValidator from '@validators/createProduct.validator';
import getProductsValidator from '@validators/getProducts.validator';
import ratingProductValidator from '@validators/ratingProduct.validator';
import updateProductValidator from '@validators/updateProduct.validator';

const router = Router();

router.post(
  '/',
  rateLimitMiddleware(1, 3),
  authenticationMiddleware,
  createProductValidator,
  validateFieldsMiddleware,
  createProductController,
);

router.delete(
  '/:slug',
  rateLimitMiddleware(1, 10),
  authenticationMiddleware,
  deleteProductController,
);

router.get('/:slug', rateLimitMiddleware(1, 60), getProductController);

router.get(
  '/',
  rateLimitMiddleware(1, 60),
  getProductsValidator,
  validateFieldsMiddleware,
  getProductsController,
);

router.patch(
  '/:slug/rating',
  rateLimitMiddleware(0.5, 2),
  authenticationMiddleware,
  ratingProductValidator,
  validateFieldsMiddleware,
  updateProductRatingController,
);

router.put(
  '/:slug',
  rateLimitMiddleware(1, 3),
  authenticationMiddleware,
  updateProductValidator,
  validateFieldsMiddleware,
  updateProductController,
);

export default router;
