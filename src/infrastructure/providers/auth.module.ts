import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthServiceImpl } from '../../application/services/impl/auth.service.impl';
import { AuthController } from '../../web/controllers/auth.controller';
import { RefreshTokenMiddleware } from '../middleware/refresh-token.middleware';
import { Auth_Mapper, Auth_Service } from '../../shared/tokens';
import { AuthMapperImpl } from '../../web/mappers/auth/auth-mapper.impl';
import UserModule from './user.module';
import BcryptModule from './bcrypt.module';

@Module({
  imports: [UserModule, BcryptModule],
  providers: [
    {
      provide: Auth_Service,
      useClass: AuthServiceImpl,
    },
    {
      provide: Auth_Mapper,
      useClass: AuthMapperImpl,
    },
  ],
  controllers: [AuthController],
})
export default class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes({
      path: '/auth/refresh',
      method: RequestMethod.ALL,
    });
  }
}
