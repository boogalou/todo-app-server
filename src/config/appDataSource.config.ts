import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entity/User.entity';
import { TaskEntity } from '../task/entity/Task.entity';
import { Migrations1726421954654 } from '../migrations/1627807023150-migrations';
import { CreateDatabaseAndSchema1627807023000 } from '../migrations/1627807023000-migrations';

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
  entities: [UserEntity, TaskEntity],
  migrations: [CreateDatabaseAndSchema1627807023000, Migrations1726421954654],
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
