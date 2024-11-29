import { TaskMapper } from './task.mapper';
import { Task } from '../../../domain/entities/task.entity';
import { TaskResponseDto } from '../../dto/task/TaskResponse.dto';
import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';
import { plainToInstance } from 'class-transformer';

export class TaskMapperImpl implements TaskMapper {
  toDto(entity: Task): TaskResponseDto {
    return plainToInstance(TaskResponseDto, entity, { excludeExtraneousValues: true });
  }

  toEntity(dto: CreateTaskDto): Task {
    return plainToInstance(Task, dto);
  }

  mergeUpdate(dto: UpdateTaskDto, entity: Task): Task {
    console.log('mergeUpdate in: ', dto);
    const updatedFields = plainToInstance(Task, dto, { excludeExtraneousValues: true });
    const result = Object.assign(entity, updatedFields);
    console.log('mergeUpdate out: ', result);
    return result;
  }
}
