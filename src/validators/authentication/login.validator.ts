import { body } from 'express-validator';

const loginValidator = [
  body('email').isEmail().withMessage('Email is required'),

  body('password').isString().withMessage('Password is required'),
];

export default loginValidator;
