const config = {
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  },
  jwtSecret: process.env.JWT_SECRET!,
  mongodbUri: process.env.MONGODB_URI!,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  productionBackendServer:
    process.env.PRODUCTION_BACKEND_SERVER || `http://localhost:${process.env.PORT || 3000}`,
};

export default config;
