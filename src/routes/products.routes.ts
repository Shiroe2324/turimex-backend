import { Router } from 'express';
import createProductController from '../controllers/products/createProduct.controller';
import deleteProductController from '../controllers/products/deleteProduct.controller';
import getProductController from '../controllers/products/getProduct.controller';
import getProductsController from '../controllers/products/getProducts.controller';
import ratingProductController from '../controllers/products/ratingProduct.controller';
import updateProductController from '../controllers/products/updateProduct.controller';
import validateFields from '../middlewares/validateFields';
import authenticate from '../middlewares/authentication';
import createProductValidator from '../validators/products/createProduct.validator';
import getProductsValidator from '../validators/products/getProducts.validator';
import ratingProductValidator from '../validators/products/ratingProduct.validator';
import updateProductValidator from '../validators/products/updateProduct.validator';

const router = Router();

router.post('/', authenticate, createProductValidator, validateFields, createProductController);

router.delete('/:slug', authenticate, deleteProductController);

router.get('/:slug', getProductController);

router.get('/', getProductsValidator, validateFields, getProductsController);

router.post(
  '/:slug/rating',
  authenticate,
  ratingProductValidator,
  validateFields,
  ratingProductController,
);

router.put('/:slug', authenticate, updateProductValidator, validateFields, updateProductController);

export default router;
