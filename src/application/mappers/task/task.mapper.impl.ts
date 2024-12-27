import { TaskMapper } from './task.mapper';
import { Task } from '../../../domain/entities/task.entity';
import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';
import { plainToInstance } from 'class-transformer';
import { TaskResponseDto } from '../../dto/task/TaskResponse.dto';

export class TaskMapperImpl implements TaskMapper {
  toDto(entity: Task): TaskResponseDto {
    return plainToInstance(TaskResponseDto, entity, { excludeExtraneousValues: true });
  }

  toEntity(dto: CreateTaskDto): Task {
    return plainToInstance(Task, dto);
  }

  mergeUpdate(dto: UpdateTaskDto, entity: Task): Task {
    const updatedFields = plainToInstance(Task, dto, { excludeExtraneousValues: true });
    return Object.assign(entity, updatedFields);
  }
}
