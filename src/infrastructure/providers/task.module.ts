import { Module } from '@nestjs/common';
import { TaskServiceImpl } from '../../application/services/impl/task.service.impl';
import { TaskController } from '../../web/controllers/task.controller';
import { Task } from '../../domain/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { JwtModule } from './jwt.module';
import { TaskRepositoryImpl } from '../repositories/task.repository.impl';
import { Task_Mapper, Task_Repository, Task_Service } from '../../shared/tokens';
import { TaskMapperImpl } from '../../web/mappers/task/task.mapper.impl';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule, JwtModule],
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
export class TaskModule {}
