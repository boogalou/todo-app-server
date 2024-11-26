import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { User } from '../../domain/entities/user.entity';
import { Task } from '../../domain/entities/task.entity';
import { Settings } from '../../domain/entities/settings.entity';
import { Migrations1732524893867 } from '../database/1732524893867-migrations';

config();

const configService = new ConfigService();

const appDataSource = new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PASS'),
  database: configService.getOrThrow('DB_NAME'),
  schema: configService.getOrThrow('DB_SCHEMA'),
  synchronize: false,
  entities: [User, Task, Settings],
  migrations: [Migrations1732524893867],
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
