import mongoose from 'mongoose';
import logger from '../../managers/logger.manager';
import config from '../../utils/config';

const MAX_RETRIES = 5;
let attempts = 0;

const connectDB = async () => {
  try {
    const db = await mongoose.connect(config.mongodbUri);
    logger.info(`MongoDB connected: ${db.connection.name}`);
  } catch (error: any) {
    logger.error('Error connecting to MongoDB:', error.message);

    attempts++;

    if (attempts < MAX_RETRIES) {
      logger.warn(`Retrying connection (${attempts}/${MAX_RETRIES})...`);
      setTimeout(connectDB, 5000);
    } else {
      logger.error('Exceeded maximum number of connection retries to MongoDB.');
      process.exit(1);
    }
  }
};

export default connectDB;
