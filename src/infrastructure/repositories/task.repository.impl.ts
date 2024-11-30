import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../domain/entities/task.entity';
import { Repository, UpdateResult } from 'typeorm';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { UpdateTaskDto } from '../../application/dto/task/update-task.dto';
import { BaseRepository } from './base.repository';

@Injectable()
export class TaskRepositoryImpl extends BaseRepository<Task> implements TaskRepository {
  constructor(
    @InjectRepository(Task)
    protected readonly repository: Repository<Task>,
  ) {
    super(repository);
  }

  public async delete(entity: Task): Promise<Task> {
    return this.handler(
      () => this.repository.remove(entity),
      'Error occurred while deleting task',
      entity.id,
    );
  }

  public async findAll(userId: number): Promise<Task[]> {
    return this.handler(
      () => this.repository.find({ where: { user: { id: userId } } }),
      `Error occurred while retrieving tasks for user`,
      userId,
    );
  }

  public async findById(id: number): Promise<Task> {
    return this.handler(
      () => this.repository.findOne({ where: { id } }),
      'Error occurred while retrieving task',
      id,
    );
  }

  public async update(id: number, dto: UpdateTaskDto): Promise<UpdateResult> {
    return this.handler(
      () => this.repository.update(id, dto),
      'Error occurred while updating task',
    );
  }

  public async save(entity: Task): Promise<Task> {
    return this.handler(() => this.repository.save(entity), 'Error occurred while saving task');
  }

  public async isExists(id: number): Promise<boolean> {
    return this.handler(
      () => this.repository.exists({ where: { id } }),
      'Error occurred while checking existence of task',
      id,
    );
  }
}
