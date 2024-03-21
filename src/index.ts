import 'dotenv/config';
import app from './app';
import connectDatabases from './managers/connection.manager';
import logger from './managers/logger.manager';
import checkEnvVariables from './utils/checkEnvVariables';
import config from './utils/config';

checkEnvVariables();
connectDatabases();

app.listen(config.port, () => {
  const envMessage =
    config.nodeEnv !== 'development'
      ? `Server listening on port ${config.port}`
      : `Server listening at ${config.productionBackendServer}`;
  logger.info(envMessage);
});
