import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import swaggerUiExpress from 'swagger-ui-express';
import corsMiddleware from './middlewares/cors.middleware';
import generalLimiterMiddleware from './middlewares/limiter.middleware';
import authenticationRoutes from './routes/authentication.routes';
import productsRoutes from './routes/products.routes';
import usersRoutes from './routes/users.routes';
import swaggerSpec from './services/swagger/swagger.service';

const app = express();

app.use(corsMiddleware);
app.use(helmet());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(generalLimiterMiddleware);
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));
app.use('/api/auth', authenticationRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);

export default app;
