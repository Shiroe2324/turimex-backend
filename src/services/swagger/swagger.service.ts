import type { Information, OAS3Options, Server, Tag } from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';

import schemas from '@swagger/schemas';
import securitySchemes from '@swagger/securitySchemes';
import config from '@utils/config';

const { productionFrontendServer, port, version } = config;

const info: Information = {
  title: 'Turimex API',
  description: 'All the information about the **API** backend for the `Turimex` program',
  version: `v${version}`,
};

const servers: Server[] = [
  {
    url: `http://localhost:${port}`,
    description: 'Development server',
  },
  {
    url: productionFrontendServer,
    description: 'Production server',
  },
];

const tags: Tag[] = [
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

const options: OAS3Options = {
  definition: {
    openapi: '3.0.1',
    info,
    servers,
    tags,
    components: {
      schemas,
      securitySchemes,
    },
  },
  apis: ['./src/services/swagger/docs/**/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
