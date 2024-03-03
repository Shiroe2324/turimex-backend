import { body } from 'express-validator';

const updateUserValidator = [
  body('username')
    .isString()
    .trim()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
];

export default updateUserValidator;
