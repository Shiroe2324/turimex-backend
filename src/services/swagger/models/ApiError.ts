const ApiError = {
  type: 'object',
  properties: {
    message: { type: 'string', example: 'Something went wrong' },
  },
};

export default ApiError;
