import { Task } from './entities/task.entity';

export interface TaskRepository {
  findById(id: number): Promise<Task | null>;

  findAll(id: number): Promise<Task[] | null>;

  save(entity: Task): Promise<Task>;

  delete(entity: Task): Promise<Task>;
}
