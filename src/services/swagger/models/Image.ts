const Image = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '6123456789012345678901' },
    public_id: { type: 'string', example: 'products/abcdef12345' },
    url: { type: 'string', example: 'https://example.com/products/abcdef12345.jpg' },
  },
};

export default Image;
