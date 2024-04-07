import logger from '../managers/logger.manager';

function checkEnvVariables() {
  const missingEnvVariables: string[] = [];
  const requiredEnvVariables = [
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'EMAIL_HOST',
    'EMAIL_PASS',
    'EMAIL_SENDER',
    'EMAIL_USER',
    'EMAIL_VERIFICATION_URL',
    'JWT_SECRET_LOGIN',
    'JWT_SECRET_VALIDATION',
    'MONGODB_URI',
    'REDIS_HOST',
    'REDIS_PASSWORD',
    'REDIS_PORT',
  ];

  for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
      missingEnvVariables.push(variable);
    }
  }

  if (missingEnvVariables.length > 0) {
    logger.error(`Missing environment variables: ${missingEnvVariables.join(', ')}`);
    process.exit(1);
  }
}

export default checkEnvVariables;
