import { Global, Module } from '@nestjs/common';
import { Bcrypt_Service } from '../../shared/tokens';
import { BcryptServiceImpl } from '../services/impl/bcrypt.service.impl';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: Bcrypt_Service,
      useClass: BcryptServiceImpl,
    },
  ],
  exports: [Bcrypt_Service],
})
export default class BcryptModule {}
