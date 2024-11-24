import { Module } from '@nestjs/common';
import { LoggerServiceImpl } from '../services/impl/logger.service';
import { createLogger } from 'winston';
import { loggerConfig } from '../configs/logger.config';

@Module({
  providers: [
    {
      provide: 'LOGGER',
      useFactory: () => createLogger(loggerConfig),
    },

    LoggerServiceImpl,
  ],
  exports: [LoggerServiceImpl],
})
export class LoggerModule {}
