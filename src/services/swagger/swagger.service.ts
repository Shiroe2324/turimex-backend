import swaggerJSDoc from 'swagger-jsdoc';
import config from '../../utils/config';
import swaggerModels from './swaggerModels';

const info: swaggerJSDoc.Information = {
  title: 'Turimex API',
  description: 'All the information about the **API** backend for the `Turimex` program',
  version: 'v0.0.1',
};

const servers: swaggerJSDoc.Server[] = [
  {
    url: config.productionBackendServer,
    description: 'Production server',
  },
  {
    url: `http://localhost:${config.port}`,
    description: 'Development server',
  },
];

const tags: swaggerJSDoc.Tag[] = [
  {
    name: 'Authentication',
    description: 'Routes for user authentication',
  },
  {
    name: 'Products',
    description: 'Routes for product management',
  },
  {
    name: 'Users',
    description: 'Routes for user management',
  },
];

const securitySchemes = {
  bearerAuth: {
    type: 'http',
    bearerFormat: 'JWT',
    scheme: 'bearer',
    description: 'JSON Web Token (`JWT`) authentication token',
  },
};

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.1',
    info,
    servers,
    tags,
    components: {
      schemas: swaggerModels,
      securitySchemes,
    },
  },
  apis: ['./src/services/swagger/docs/**/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
