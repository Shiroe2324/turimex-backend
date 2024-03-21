import swaggerJSDoc from 'swagger-jsdoc';
import swaggerModels from './swaggerModels';
import config from '../../utils/config';

const info: swaggerJSDoc.Information = {
  title: 'Turimex API',
  description: 'Toda la información sobre el backend de tipo **API** para el programa de `Turimex`',
  version: 'v0.0.1',
};

const servers: swaggerJSDoc.Server[] = [
  {
    url: config.productionBackendServer,
    description: 'Servidor de producción',
  },
  {
    url: `http://localhost:${config.port}`,
    description: 'Servidor de desarrollo',
  },
];

const tags: swaggerJSDoc.Tag[] = [
  {
    name: 'Authentication',
    description: 'Rutas para la autenticación del usuario',
  },
  {
    name: 'Products',
    description: 'Rutas para la gestión de productos',
  },
  {
    name: 'Users',
    description: 'Rutas para la gestión de usuarios',
  },
];

const securitySchemes = {
  bearerAuth: {
    type: 'http',
    bearerFormat: 'JWT',
    scheme: 'bearer',
    description: 'Token de autenticación de tipo **JSON Web Token** (`JWT`)',
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
