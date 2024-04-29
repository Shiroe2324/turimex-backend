import winstonService from '@winston/winston.service';

const logger = {
  debug: winstonService.debug.bind(winstonService),
  error: winstonService.error.bind(winstonService),
  info: winstonService.info.bind(winstonService),
  log: winstonService.log.bind(winstonService),
  silly: winstonService.silly,
  verbose: winstonService.verbose,
  warn: winstonService.warn,
};

export default logger;
