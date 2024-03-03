import { body } from 'express-validator';

const registerValidator = [
  body('username')
    .isString()
    .trim()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),

  body('email').isEmail().withMessage('Email is required'),

  body('password')
    .isString()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export default registerValidator;
