import { body, check } from 'express-validator';
import validateImageFile from '../image.validator';

const createProductValidator = [
  body('name')
    .isString()
    .trim()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  check('files').custom(validateImageFile),

  body('category').isString().trim().withMessage('Category is required'),

  body('price').isNumeric().withMessage('Price must be a number'),

  body('brand').isString().trim().withMessage('Brand is required'),

  body('countInStock').isNumeric().withMessage('Count in stock must be a number'),

  body('description').isString().trim().withMessage('Description is required'),
];

export default createProductValidator;
