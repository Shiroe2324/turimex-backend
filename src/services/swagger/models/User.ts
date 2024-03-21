const User = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '6123456789012345678901' },
    avatar: { $ref: '#/components/schemas/Image' },
    email: { type: 'string', example: 'john.doe@example.com' },
    isAdmin: { type: 'boolean', example: false },
    isVerified: { type: 'boolean', example: true },
    username: { type: 'string', example: 'john_doe' },
    userId: { type: 'string', example: '123' },
    createdAt: { type: 'string', example: '2022-01-01T00:00:00.000Z' },
    updatedAt: { type: 'string', example: '2022-01-01T00:00:00.000Z' },
  },
};

export default User;
