import winston, { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.timestamp(),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  }),
);

const fileRotateTransport = new DailyRotateFile({
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

const consoleTransport = new transports.Console({
  format: format.combine(format.colorize(), logFormat),
});

const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: process.env.NODE_ENV === 'development' ? 4 : 2,
};

const winstonService = winston.createLogger({
  levels: customLevels,
  level: 'info',
  format: logFormat,
  transports: [fileRotateTransport, consoleTransport],
});

export default winstonService;