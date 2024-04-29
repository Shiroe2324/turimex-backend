import type { Reference, SecurityScheme } from 'swagger-jsdoc';

type SecuritySchemes = {
  [key: string]: Reference | SecurityScheme;
};

const securitySchemes: SecuritySchemes = {
  bearerAuth: {
    type: 'http',
    bearerFormat: 'JWT',
    scheme: 'bearer',
    description: 'JSON Web Token (`JWT`) authentication token',
  },
};

export default securitySchemes;
