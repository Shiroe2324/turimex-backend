const port = Number(process.env.PORT) || 3000;

const config = {
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  },
  jwtSecret: process.env.JWT_SECRET!,
  mongodbUri: process.env.MONGODB_URI!,
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  productionBackendServer: process.env.PRODUCTION_BACKEND_SERVER || `http://localhost:${port}`,
  productionFrontendServer: process.env.PRODUCTION_FRONTEND_SERVER || 'http://localhost:4000',
};

export default config;
