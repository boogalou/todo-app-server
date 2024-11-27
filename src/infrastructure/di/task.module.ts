import { Module } from '@nestjs/common';
import { TaskServiceImpl } from '../../application/services/impl/task.service.impl';
import { TaskController } from '../../web/controllers/task.controller';
import { Task } from '../../domain/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepositoryImpl } from '../repositories/task.repository.impl';
import { Task_Mapper, Task_Repository, Task_Service } from '../../shared/tokens';
import { TaskMapperImpl } from '../../application/mappers/task/task.mapper.impl';
import UserModule from './user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule],
  providers: [
    {
      provide: Task_Service,
      useClass: TaskServiceImpl,
    },
    {
      provide: Task_Repository,
      useClass: TaskRepositoryImpl,
    },
    {
      provide: Task_Mapper,
      useClass: TaskMapperImpl,
    },
  ],
  controllers: [TaskController],
  exports: [Task_Service],
})
export default class TaskModule {}
