import { Task } from '../../domain/entities/task.entity';
import { UpdateTaskDto } from '../dto/task/update-task.dto';
import { CreateTaskDto } from '../dto/task/create-task.dto';
import { TaskResponseDto } from '../dto/task/TaskResponse.dto';

export interface TaskService {
  create(dto: CreateTaskDto, id: number): Promise<TaskResponseDto>;

  getById(id: number): Promise<Task | null>;

  getAll(userId: number): Promise<Task[]>;

  update(dto: UpdateTaskDto): Promise<Task>;

  save(entity: Task): Promise<Task>;

  delete(taskId: number, userId: number): Promise<boolean>;

  isOwner(userId: number, resourceId: number): Promise<boolean>;
}
