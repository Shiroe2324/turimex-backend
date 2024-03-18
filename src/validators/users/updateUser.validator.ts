import { body } from 'express-validator';

const updateUserValidator = [
  body('username')
    .optional()
    .isString()
    .trim()
    .withMessage('Username must be a string')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),

  body('password')
    .optional()
    .isString()
    .trim()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export default updateUserValidator;
