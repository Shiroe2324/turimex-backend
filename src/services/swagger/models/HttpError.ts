const HttpError = {
  type: 'object',
  properties: {
    status: { type: 'string', example: 'error' },
    statusCode: { type: 'number', example: 500 },
    message: { type: 'string', example: 'Something went wrong' },
  },
};

export default HttpError;
