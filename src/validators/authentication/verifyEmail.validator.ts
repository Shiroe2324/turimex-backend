import { body } from 'express-validator';

const verifyEmailValidator = [body('token').isString().withMessage('Token must be a string')];

export default verifyEmailValidator;
