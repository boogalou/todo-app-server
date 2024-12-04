import { Global, Module } from '@nestjs/common';
import { Formatter_Service } from '../../shared/tokens';
import { ExceptionFormatterServiceImpl } from '../services/impl/exception-formatter.service.impl';

@Global()
@Module({
  providers: [
    {
      provide: Formatter_Service,
      useClass: ExceptionFormatterServiceImpl,
    },
  ],
  exports: [Formatter_Service],
})
export class ExceptionFormatterModule {}
