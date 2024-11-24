import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthServiceImpl } from '../../application/services/impl/auth.service.impl';
import { AuthController } from '../../web/controllers/auth.controller';
import { UserModule } from './user.module';
import { JwtModule } from './jwt.module';
import { RefreshTokenMiddleware } from '../middleware/refresh-token.middleware';
import { Auth_Mapper, Auth_Service } from '../../shared/tokens';
import { AuthMapperImpl } from '../../web/mappers/auth/auth-mapper.impl';

@Module({
  imports: [UserModule, JwtModule],
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
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes({
      path: '/auth/refresh',
      method: RequestMethod.ALL,
    });
  }
}
