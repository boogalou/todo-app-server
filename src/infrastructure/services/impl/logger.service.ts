import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LoggerService } from '../logger.service';

@Injectable()
export class LoggerServiceImpl implements LoggerService {
  constructor(
    @Inject('LOGGER')
    private readonly logger: Logger,
  ) {}

  public info(message: any, meta?: unknown[]) {
    this.logger.info(message, ...(meta || []));
  }

  public warn(message: any, meta?: unknown[]) {
    this.logger.warn(message, ...(meta || []));
  }

  public error(message: any, meta?: unknown[]) {
    this.logger.error(message, ...(meta || []));
  }

  public debug(message: any, meta?: unknown[]) {
    this.logger.debug(message, ...(meta || []));
  }
}
