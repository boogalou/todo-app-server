import { Task } from '../../domain/entities/task.entity';
import { UpdateTaskDto } from '../../web/dto/task/update-task.dto';
import { CreateTaskDto } from '../../web/dto/task/create-task.dto';

export interface TaskService {
  create(dto: CreateTaskDto): Promise<Task>;

  getById(id: number): Promise<Task | null>;

  getAll(userId: number): Promise<Task[]>;

  update(dto: UpdateTaskDto): Promise<Task>;

  save(entity: Task): Promise<Task>;

  delete(taskId: number, userId: number): Promise<boolean>;

  isOwner(userId: number, resourceId: number): Promise<boolean>;
}
