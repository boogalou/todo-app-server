import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const dbconnectConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.getOrThrow('DB_HOST'),
    port: configService.getOrThrow('DB_PORT'),
    username: configService.getOrThrow('DB_USER'),
    password: configService.getOrThrow('DB_PASS'),
    database: configService.getOrThrow('DB_NAME'),
    schema: configService.getOrThrow('DB_SCHEMA'),
    synchronize: false,
    autoLoadEntities: true,
  }),
};
