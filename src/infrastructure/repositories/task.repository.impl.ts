import { Inject, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../domain/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { Logger_Service } from '../../shared/tokens';

@Injectable()
export class TaskRepositoryImpl implements TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
    @Inject(Logger_Service)
    private readonly logger: LoggerService,
  ) {}

  public async delete(entity: Task): Promise<Task> {
    try {
      return await this.repository.remove(entity);
    } catch (err) {
      this.logger.error(
        `Error occurred while deleting task with ID ${entity.id}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to delete task. Task ID: ${entity.id}. Please try again later.`,
      );
    }
  }

  public async findAll(userId: number): Promise<Task[] | null> {
    try {
      return await this.repository.find({ where: { user: { id: userId } } });
    } catch (err) {
      this.logger.error(
        `Error occurred while retrieving tasks for user with ID ${userId}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to retrieve tasks for user with ID ${userId}. Please try again later.`,
      );
    }
  }

  public async findById(id: number): Promise<Task | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (err) {
      this.logger.error(
        `Error occurred while retrieving task with ID ${id}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to retrieve task with ID ${id}. Please try again later.`,
      );
    }
  }

  public async save(entity: Task): Promise<Task> {
    try {
      return await this.repository.save(entity);
    } catch (err) {
      this.logger.error(
        `Error occurred while saving task. Task details: ${JSON.stringify(entity)}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to save task. Please check the provided data and try again.`,
      );
    }
  }
}
