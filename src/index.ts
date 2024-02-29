import 'dotenv/config';
import app from './app';
import connectDatabases from './managers/connection.manager';
import logger from './managers/logger.manager';
import config from './utils/config';

const port = process.env.PORT || 3000;
const requiredEnvVariables = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    logger.error(`Missing environment variable: ${variable}`);
    process.exit(1);
  }
}

connectDatabases();

app.listen(port, () => {
  const envMessage =
    config.nodeEnv !== 'development'
      ? `Server listening on port ${port}`
      : `Server listening at http://localhost:${port}`;
  logger.info(envMessage);
});
