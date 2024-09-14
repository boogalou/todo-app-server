import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entity/User.entity';
import { TaskEntity } from '../task/entity/Task.entity';
import { Migrations1726318800611 } from '../migrations/1726318800611-migrations';

config();

const configService = new ConfigService();

const appDataSource = new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PASS'),
  database: configService.getOrThrow('DB_NAME'),
  synchronize: false,
  entities: [UserEntity, TaskEntity],
  migrations: [Migrations1726318800611],
});

appDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default appDataSource;
