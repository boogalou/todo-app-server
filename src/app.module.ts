import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbconnectConfig } from './infrastructure/configs/dbconnect.config';
import { AuthMiddleware } from './infrastructure/middleware/auth.middleware';
import AuthModule from './infrastructure/providers/auth.module';
import BcryptModule from './infrastructure/providers/bcrypt.module';
import JwtModule from './infrastructure/providers/jwt.module';
import LoggerModule from './infrastructure/providers/logger.module';
import SettingsModule from './infrastructure/providers/settings.module';
import TaskModule from './infrastructure/providers/task.module';
import UserModule from './infrastructure/providers/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(dbconnectConfig),
    AuthModule,
    BcryptModule,
    JwtModule,
    LoggerModule,
    SettingsModule,
    TaskModule,
    UserModule,
  ],
  providers: [Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/users/registration', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
