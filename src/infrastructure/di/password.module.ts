import { Global, Module } from '@nestjs/common';
import { Password_Service } from '../../shared/tokens';
import { PasswordServiceImpl } from '../services/impl/password.service.impl';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: Password_Service,
      useClass: PasswordServiceImpl,
    },
  ],
  exports: [Password_Service],
})
export default class PasswordModule {}
