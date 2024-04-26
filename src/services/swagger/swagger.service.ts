import swaggerJSDoc from 'swagger-jsdoc';
import config from '../../utils/config';
import swaggerModels from './swaggerModels';

const { productionFrontendServer, port, version } = config;

const info: swaggerJSDoc.Information = {
  title: 'Turimex API',
  description: 'All the information about the **API** backend for the `Turimex` program',
  version: `v${version}`,
};

const servers: swaggerJSDoc.Server[] = [
  {
    url: `http://localhost:${port}`,
    description: 'Development server',
  },
  {
    url: productionFrontendServer,
    description: 'Production server',
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
