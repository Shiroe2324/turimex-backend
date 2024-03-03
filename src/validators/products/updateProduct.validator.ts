import { body, check } from 'express-validator';
import validateImageFile from '../image.validator';

const updateProductValidator = [
  body('name')
    .optional()
    .isString()
    .trim()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  check('files').optional().custom(validateImageFile),

  body('oldImages').optional().isArray().withMessage('Old images must be an array'),

  body('category').optional().isString().trim().withMessage('Category is required'),

  body('price').optional().isNumeric().withMessage('Price must be a number'),

  body('brand').optional().isString().trim().withMessage('Brand is required'),

  body('countInStock').optional().isNumeric().withMessage('Count in stock must be a number'),

  body('description').optional().isString().trim().withMessage('Description is required'),
];

export default updateProductValidator;
