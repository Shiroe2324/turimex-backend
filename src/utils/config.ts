const port = Number(process.env.PORT) || 3000;

const config = {
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  },
  email: {
    host: process.env.EMAIL_HOST!,
    pass: process.env.EMAIL_PASS!,
    port: Number(process.env.EMAIL_PORT) || 465,
    sender: process.env.EMAIL_SENDER!,
    user: process.env.EMAIL_USER!,
    verificationUrl: process.env.EMAIL_VERIFICATION_URL!,
  },
  jwtSecrets: {
    login: process.env.JWT_SECRET_LOGIN!,
    validation: process.env.JWT_SECRET_VALIDATION!,
  },
  mongodbUri: process.env.MONGODB_URI!,
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  productionBackendServer: process.env.PRODUCTION_BACKEND_SERVER || `http://localhost:${port}`,
  productionFrontendServer: process.env.PRODUCTION_FRONTEND_SERVER || 'http://localhost:4000',
  redis: {
    host: process.env.REDIS_HOST!,
    password: process.env.REDIS_PASSWORD!,
    port: Number(process.env.REDIS_PORT!),
  },
};

export default config;
