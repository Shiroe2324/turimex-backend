import type { Reference, Schema } from 'swagger-jsdoc';

const Image: Reference | Schema = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '6123456789012345678901' },
    public_id: { type: 'string', example: 'images/abcdef12345' },
    url: { type: 'string', example: 'https://example.com/images/abcdef12345.jpg' },
  },
};

export default Image;
