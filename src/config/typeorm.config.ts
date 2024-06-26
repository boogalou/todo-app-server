import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entity/UserEntity';
import { TaskEntity } from '../task/entity/Task.entity';
import { Migrations1713441311419 } from '../migrations/1713441311419-migrations';

config();

const configService = new ConfigService();

const typeormConfig = new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PASS'),
  database: configService.getOrThrow('DB_NAME'),
  synchronize: false,
  entities: [UserEntity, TaskEntity],
  migrations: [Migrations1713441311419],
});

export default typeormConfig;
