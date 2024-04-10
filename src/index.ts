import 'dotenv/config';
import app from './app';
import connectDatabases from './managers/connection.manager';
import logger from './managers/logger.manager';
import config from './utils/config';

connectDatabases();

app.listen(config.port, () => {
  const envMessage =
    config.nodeEnv !== 'development'
      ? `Server listening at ${config.productionBackendServer}`
      : `Server listening at http://localhost:${config.port}`;
  logger.info(envMessage);
});
