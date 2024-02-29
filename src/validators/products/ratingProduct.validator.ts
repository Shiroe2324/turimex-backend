import { body } from 'express-validator';

const ratingProductValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  body('comment').optional().isString().withMessage('Comment must be a string'),
];

export default ratingProductValidator;
