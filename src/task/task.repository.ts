import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entity/Task.entity';
import { Repository } from 'typeorm';
import appDataSource from '../config/typeorm.config';
import { EditTaskDto } from './dto/EditTask.dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}

  async save(task: TaskEntity) {
    try {
      return await this.repository.save(task);
    } catch (err) {
      throw new InternalServerErrorException(`Failed to save task. Database: error: ${err}`);
    }
  }

  async update(taskId: number, task: EditTaskDto) {
    try {
      return await this.repository.update(taskId, task);
    } catch (err) {
      throw new InternalServerErrorException(`Failed to update task. Database: error: ${err}`);
    }
  }

  async remove(task: TaskEntity) {
    try {
      return await this.repository.remove(task);
    } catch (err) {
      throw new InternalServerErrorException(`Failed to remove task. Database: error: ${err}`);
    }
  }

  async findById(taskId: number) {
    return await this.repository.findOne({
      where: { id: taskId },
      select: [
        'id',
        'title',
        'description',
        'color',
        'category',
        'dueDate',
        'createdAt',
        'updatedAt',
        'isCompleted',
      ],
      relations: ['user'],
    });
  }

  async findAll(userId: number) {
    try {
      return await appDataSource.manager
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .select([
          'task.id',
          'task.title',
          'task.description',
          'task.color',
          'task.category',
          'task.dueDate',
          'task.createdAt',
          'task.updatedAt',
          'task.isCompleted',
        ])
        .where('task.user.id = :userId', { userId })
        .orderBy('task.createdAt', 'ASC')
        .getMany();
    } catch (err) {
      throw new InternalServerErrorException(
        `Task repository: Failed find tasks. Database error: ${err}`,
      );
    }
  }
}
