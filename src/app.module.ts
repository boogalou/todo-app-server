import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbconnectConfig } from './infrastructure/configs/dbconnect.config';
import { AuthMiddleware } from './infrastructure/middleware/auth.middleware';
import AuthModule from './infrastructure/di/auth.module';
import PasswordModule from './infrastructure/di/password.module';
import JwtModule from './infrastructure/di/jwt.module';
import LoggerModule from './infrastructure/di/logger.module';
import SettingsModule from './infrastructure/di/settings.module';
import TaskModule from './infrastructure/di/task.module';
import UserModule from './infrastructure/di/user.module';
import { OwnershipModule } from './infrastructure/di/ownership.module';
import { ExceptionFormatterModule } from './infrastructure/di/exception-formatter.module';
import { FileStorageModule } from './infrastructure/di/file-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(dbconnectConfig),
    AuthModule,
    PasswordModule,
    JwtModule,
    LoggerModule,
    SettingsModule,
    TaskModule,
    UserModule,
    OwnershipModule,
    ExceptionFormatterModule,
    FileStorageModule,
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
