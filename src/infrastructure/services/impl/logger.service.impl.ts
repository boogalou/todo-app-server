import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LoggerService } from '../../../application/services/logger.service';
import { Logger_Service } from '../../../shared/tokens';

@Injectable()
export class LoggerServiceImpl implements LoggerService {
  constructor(
    @Inject(Logger_Service)
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
