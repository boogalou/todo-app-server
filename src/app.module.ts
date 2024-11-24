import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbconnectConfig } from './infrastructure/configs/dbconnect.config';
import { UserModule } from './infrastructure/providers/user.module';
import { AuthModule } from './infrastructure/providers/auth.module';
import { TaskModule } from './infrastructure/providers/task.module';
import { JwtModule } from './infrastructure/providers/jwt.module';
import { AuthMiddleware } from './infrastructure/middleware/auth.middleware';
import { LoggerModule } from './infrastructure/providers/logger.module';
import { SettingsModule } from './infrastructure/providers/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(dbconnectConfig),
    UserModule,
    AuthModule,
    TaskModule,
    JwtModule,
    LoggerModule,
    SettingsModule,
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
