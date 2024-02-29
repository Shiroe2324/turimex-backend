import { query } from 'express-validator';

const getUsersValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a number greater than 0'),

  query('pageSize')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page size must be a number greater than 0'),

  query('sort')
    .optional()
    .isIn(['createdAt:asc', 'createdAt:desc'])
    .withMessage('Sort must be one of the following: createdAt:asc, createdAt:desc'),
];

export default getUsersValidator;
