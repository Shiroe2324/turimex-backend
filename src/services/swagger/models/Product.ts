import type { Reference, Schema } from 'swagger-jsdoc';

const Product: Reference | Schema = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '6123456789012345678901' },
    brand: { type: 'string', example: 'Apple' },
    category: { type: 'string', example: 'Electronics' },
    countInStock: { type: 'integer', example: 10 },
    creatorId: { type: 'string', example: '123' },
    description: { type: 'string', example: 'This is a description' },
    images: { type: 'array', items: { $ref: '#/components/schemas/Image' } },
    name: { type: 'string', example: 'iPhone 12' },
    price: { type: 'number', example: 999.99 },
    rating: { $ref: '#/components/schemas/RatingProduct' },
    slug: { type: 'string', example: 'iphone-12' },
    createdAt: { type: 'string', example: '2022-01-01T00:00:00.000Z' },
    updatedAt: { type: 'string', example: '2022-01-01T00:00:00.000Z' },
  },
};

export default Product;
