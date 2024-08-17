import winston, { LoggerOptions } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import chalk from 'chalk';

const jsonFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'HH:MM:ss DD.MM.YYYY',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

export const loggerConfig: LoggerOptions = {
  level: 'info',
  format: jsonFormat,
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '10d',
      maxSize: '10m',
      format: jsonFormat,
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '10d',
      maxSize: '10m',
      format: jsonFormat,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.printf(({ level, message, timestamp }) => {
          let coloredLevel = level;
          let coloredMessage = message;
          let coloredTimestamp = timestamp;

          switch (level) {
            case 'info':
              coloredLevel = chalk.bold.bgHex('#91C483').hex('#525E75')(level);
              coloredMessage = chalk.hex('#A1B57D')(message);
              coloredTimestamp = chalk.hex('#A1B57D')(timestamp);
              break;

            case 'warn':
              coloredLevel = chalk.bold.bgHex('#E9B824').hex('#3D3B40')(level);
              coloredMessage = chalk.hex('#FFC85C')(message);
              coloredTimestamp = chalk.hex('#FFC85C')(timestamp);
              break;

            case 'error':
              coloredLevel = chalk.bold.bgHex('#EF6262').hex('#2D2727')(level);
              coloredMessage = chalk.hex('#E96479')(message);
              coloredTimestamp = chalk.hex('#E96479')(timestamp);
              break;

            default:
              break;
          }

          return `${coloredLevel} ${coloredTimestamp}: ${coloredMessage}, `;
        }),
      ),
    }),
  ],
};
