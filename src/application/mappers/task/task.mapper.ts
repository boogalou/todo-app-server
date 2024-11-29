import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { Task } from '../../../domain/entities/task.entity';
import { TaskResponseDto } from '../../dto/task/TaskResponse.dto';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';

export interface TaskMapper {
  toEntity(dto: CreateTaskDto): Task;
  mergeUpdate(dto: UpdateTaskDto, entity: Task): Task;
  toDto(entity: Task): TaskResponseDto;
}
