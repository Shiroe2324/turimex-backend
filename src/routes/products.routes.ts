import { Router } from 'express';
import createProductController from '../controllers/products/createProduct.controller';
import deleteProductController from '../controllers/products/deleteProduct.controller';
import getProductController from '../controllers/products/getProduct.controller';
import getProductsController from '../controllers/products/getProducts.controller';
import ratingProductController from '../controllers/products/ratingProduct.controller';
import updateProductController from '../controllers/products/updateProduct.controller';
import authenticationMiddleware from '../middlewares/authentication.middleware';
import validateFieldsMiddleware from '../middlewares/validateFields.middleware';
import createProductValidator from '../validators/products/createProduct.validator';
import getProductsValidator from '../validators/products/getProducts.validator';
import ratingProductValidator from '../validators/products/ratingProduct.validator';
import updateProductValidator from '../validators/products/updateProduct.validator';

const router = Router();

router.post(
  '/',
  authenticationMiddleware,
  createProductValidator,
  validateFieldsMiddleware,
  createProductController,
);

router.delete('/:slug', authenticationMiddleware, deleteProductController);

router.get('/:slug', getProductController);

router.get('/', getProductsValidator, validateFieldsMiddleware, getProductsController);

router.patch(
  '/:slug/rating',
  authenticationMiddleware,
  ratingProductValidator,
  validateFieldsMiddleware,
  ratingProductController,
);

router.put(
  '/:slug',
  authenticationMiddleware,
  updateProductValidator,
  validateFieldsMiddleware,
  updateProductController,
);

export default router;
