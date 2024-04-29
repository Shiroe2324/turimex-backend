import type { Reference, Schema } from 'swagger-jsdoc';

const RatingProduct: Reference | Schema = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '6123456789012345678901' },
    average: { type: 'number', example: 5 },
    total: { type: 'integer', example: 1 },
    users: { type: 'array', items: { $ref: '#/components/schemas/RatingUser' } },
  },
};

export default RatingProduct;
