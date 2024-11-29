import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from '../../application/dto/task/update-task.dto';
import { UpdateResult } from 'typeorm';

export interface TaskRepository {
  findById(id: number): Promise<Task | null>;

  findAll(id: number): Promise<Task[] | null>;

  update(id: number, dto: UpdateTaskDto): Promise<UpdateResult>;

  save(entity: Task): Promise<Task>;

  delete(entity: Task): Promise<Task>;
}
