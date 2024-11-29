import { Task } from '../../domain/entities/task.entity';
import { UpdateTaskDto } from '../dto/task/update-task.dto';
import { CreateTaskDto } from '../dto/task/create-task.dto';
import { TaskResponseDto } from '../dto/task/TaskResponse.dto';

export interface TaskService {
  create(dto: CreateTaskDto, id: number): Promise<TaskResponseDto>;

  update(dto: UpdateTaskDto, id: number): Promise<TaskResponseDto>;

  delete(id: number): Promise<void>;

  getById(id: number): Promise<Task>;

  getAll(email: string, userId: number): Promise<TaskResponseDto[]>;

  isExists(id: number): Promise<boolean>;

  save(entity: Task): Promise<Task>;

  isOwner(userId: number, resourceId: number): Promise<boolean>;
}
