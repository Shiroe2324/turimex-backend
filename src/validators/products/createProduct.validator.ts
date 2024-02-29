import { body, check } from 'express-validator';
import validateImageFile from '../image.validator';

const createProductValidator = [
  body('name')
    .isString()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  check('files').custom(validateImageFile),

  body('slug').isString().withMessage('Slug is required'),

  body('category').isString().withMessage('Category is required'),

  body('price').isNumeric().withMessage('Price must be a number'),

  body('brand').isString().withMessage('Brand is required'),

  body('countInStock').isNumeric().withMessage('Count in stock must be a number'),

  body('description').isString().withMessage('Description is required'),
];

export default createProductValidator;
