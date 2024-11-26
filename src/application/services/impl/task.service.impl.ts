import { Inject, Injectable } from '@nestjs/common';
import { Task_Repository, User_Repository } from '../../../shared/tokens';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { TaskService } from '../task.service';
import { CreateTaskDto } from '../../../web/dto/task/create-task.dto';
import { UpdateTaskDto } from '../../../web/dto/task/update-task.dto';
import { Task } from '../../../domain/entities/task.entity';

@Injectable()
export class TaskServiceImpl implements TaskService {
  constructor(
    @Inject(Task_Repository)
    private readonly tasksRepository: TaskRepository,
    @Inject(User_Repository)
    private readonly userRepository: UserRepository,
  ) {}

  public async create(dto: CreateTaskDto): Promise<Task> {
    return Promise.resolve(undefined);
  }

  public async delete(taskId: number, userId: number): Promise<boolean> {
    return false;
  }

  public async getAll(userId: number): Promise<Task[]> {
    return await this.tasksRepository.findAll(userId);
  }

  public async getById(id: number): Promise<Task | null> {
    return await this.tasksRepository.findById(id);
  }

  public async save(entity: Task): Promise<Task> {
    return await this.tasksRepository.save(entity);
  }

  public async update(dto: UpdateTaskDto): Promise<Task> {
    return Promise.resolve(undefined);
  }

  public async isOwner(userId: number, resourceId: number): Promise<boolean> {
    const task = await this.getById(resourceId);
    return task && userId === task.user.id;
  }
}
