import { Logger, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './entity/Task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { TaskRepository } from './task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), UserModule, JwtModule],
  providers: [TaskService, TaskRepository, Logger],
  controllers: [TaskController],
})
export class TaskModule {}
