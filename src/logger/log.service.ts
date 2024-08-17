import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { loggerConfig } from './config/logger.config';

@Injectable()
export class LogService implements LogService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(loggerConfig);
  }

  public info(message: any, ...meta: unknown[]) {
    this.logger.info(message, ...meta);
  }

  public warn(message: any, ...meta: unknown[]) {
    this.logger.warn(message, ...meta);
  }

  public error(message: any, ...meta: unknown[]) {
    this.logger.error(message, ...meta);
  }
}
