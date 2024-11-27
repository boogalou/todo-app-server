import { Global, Module } from '@nestjs/common';
import { createLogger } from 'winston';
import { loggerConfig } from '../configs/logger.config';
import { Logger_Service } from '../../shared/tokens';

@Global()
@Module({
  providers: [
    {
      provide: Logger_Service,
      useFactory: () => createLogger(loggerConfig),
    },
  ],
  exports: [Logger_Service],
})
export default class LoggerModule {}
