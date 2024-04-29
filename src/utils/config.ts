import logger from '@managers/logger.manager';
import { version } from '@package';

function getEnv(env: string): string | undefined {
  return Bun.env[env];
}

function getEnvRequired(env: string): string {
  const value = getEnv(env);
  if (!value) {
    logger.error(`Missing required environment variable: ${env}`);
    process.exit(1);
  }
  return value;
}

const port = Number(getEnv('PORT')) || 3000;

const config = {
  cloudinary: {
    apiKey: getEnvRequired('CLOUDINARY_API_KEY'),
    apiSecret: getEnvRequired('CLOUDINARY_API_SECRET'),
    cloudName: getEnvRequired('CLOUDINARY_CLOUD_NAME'),
  },
  email: {
    host: getEnvRequired('EMAIL_HOST'),
    pass: getEnvRequired('EMAIL_PASS'),
    port: Number(getEnv('EMAIL_PORT')) || 465,
    sender: getEnvRequired('EMAIL_SENDER'),
    user: getEnvRequired('EMAIL_USER'),
    verificationUrl: getEnvRequired('EMAIL_VERIFICATION_URL'),
  },
  jwtSecrets: {
    login: getEnvRequired('JWT_SECRET_LOGIN'),
    validation: getEnvRequired('JWT_SECRET_VALIDATION'),
  },
  mongodbUri: getEnvRequired('MONGODB_URI'),
  nodeEnv: getEnv('NODE_ENV') || 'development',
  port,
  productionBackendServer: getEnv('PRODUCTION_BACKEND_SERVER') || `http://localhost:${port}`,
  productionFrontendServer: getEnv('PRODUCTION_FRONTEND_SERVER') || 'http://localhost:4000',
  redis: {
    host: getEnvRequired('REDIS_HOST'),
    password: getEnvRequired('REDIS_PASSWORD'),
    port: Number(getEnvRequired('REDIS_PORT')),
  },
  version,
};

export default config;
