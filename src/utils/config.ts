const config = {
  jwtSecret: process.env.JWT_SECRET!,
  mongodbUri: process.env.MONGODB_URI!,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
};

export default config;
