import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbconnectConfig } from './config/dbconnect.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(dbconnectConfig),
    UserModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
