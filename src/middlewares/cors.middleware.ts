import cors from 'cors';
import config from '../utils/config';

const corsOptions = {
  origin: [
    `http://localhost:${config.port}`,
    config.productionBackendServer,
    config.productionFrontendServer,
  ], // Allowed origins
  credentials: true, // Allow cookies
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
