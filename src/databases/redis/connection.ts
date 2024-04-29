import { createClient } from 'redis';

import logger from '@managers/logger.manager';
import config from '@utils/config';

const MAX_RETRIES = 5;
const { redis } = config;

const client = createClient({
  password: redis.password,
  socket: {
    host: redis.host,
    port: redis.port,
    reconnectStrategy: (retries, error) => {
      if (MAX_RETRIES < retries) {
        logger.error('Error connecting to Redis:', error.message);
        logger.warn(`Retrying connection to Redis (${retries}/${MAX_RETRIES})...`);
        return 5000;
      } else {
        logger.error('Exceeded maximum number of connection retries to Redis.');
        process.exit(1);
      }
    },
  },
});

const connectDB = async () => {
  client.on('error', (error) => {
    logger.error('Redis Client Error', error);
  });

  await client.connect();
  logger.info(`Redis connected on port: ${redis.port}`);
};

export const getRedisClient = () => client;

export default connectDB;
