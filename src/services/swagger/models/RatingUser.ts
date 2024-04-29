import type { Reference, Schema } from 'swagger-jsdoc';

const RatingUser: Reference | Schema = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '6123456789012345678901' },
    comment: { type: 'string', example: 'This product is amazing' },
    rating: { type: 'number', example: 5 },
    userId: { type: 'string', example: '123' },
  },
};

export default RatingUser;
