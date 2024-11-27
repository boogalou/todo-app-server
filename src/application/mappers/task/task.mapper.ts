import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { Task } from '../../../domain/entities/task.entity';
import { TaskResponseDto } from '../../dto/task/TaskResponse.dto';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';

export interface TaskMapper {
  toEntityFromCreate(dto: CreateTaskDto): Task;
  toEntityFromUpdate(dto: UpdateTaskDto): Task;
  toDto(entity: Task): TaskResponseDto;
}
