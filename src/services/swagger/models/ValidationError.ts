const ValidationErrorItem = {
  type: 'object',
  properties: {
    type: { type: 'string', example: 'field' },
    msg: { type: 'string', example: 'No files have been selected.' },
    path: { type: 'string', example: 'files' },
    location: { type: 'string', example: 'body' },
  },
};

const ValidationError = {
  type: 'object',
  properties: {
    message: { type: 'string', example: 'Validation Error' },
    errors: { type: 'array', items: ValidationErrorItem },
  },
};

export default ValidationError;
