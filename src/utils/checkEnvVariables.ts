import logger from '../managers/logger.manager';

function checkEnvVariables() {
  const missingEnvVariables = [];
  const requiredEnvVariables = [
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'EMAIL_HOST',
    'EMAIL_PASS',
    'EMAIL_USER',
    'EMAIL_VERIFICATION_URL',
    'JWT_SECRET',
    'MONGODB_URI',
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
