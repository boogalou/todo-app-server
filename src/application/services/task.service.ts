import { Task } from '../../domain/entities/task.entity';
import { UpdateTaskDto } from '../dto/task/update-task.dto';
import { CreateTaskDto } from '../dto/task/create-task.dto';
import { TaskResponseDto } from '../dto/task/TaskResponse.dto';

export interface TaskService {
  create(dto: CreateTaskDto, id: number): Promise<TaskResponseDto>;

  update(dto: UpdateTaskDto, id: number): Promise<TaskResponseDto>;

  delete(taskId: number, userId: number): Promise<boolean>;

  getById(id: number): Promise<Task>;

  getAll(userId: number): Promise<TaskResponseDto[]>;

  save(entity: Task): Promise<Task>;

  isOwner(userId: number, resourceId: number): Promise<boolean>;
}
