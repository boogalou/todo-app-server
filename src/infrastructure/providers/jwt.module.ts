import { Module } from '@nestjs/common';
import { JwtServiceImpl } from '../services/impl/jwt.service.impl';
import { Jwt_Service } from '../../shared/tokens';

@Module({
  providers: [
    {
      provide: Jwt_Service,
      useClass: JwtServiceImpl,
    },
  ],
  exports: [Jwt_Service],
})
export class JwtModule {}
