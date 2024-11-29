import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logger_Service, Task_Mapper, Task_Repository, User_Service } from '../../../shared/tokens';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { TaskService } from '../task.service';
import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';
import { Task } from '../../../domain/entities/task.entity';
import { UserService } from '../user.service';
import { TaskMapper } from '../../mappers/task/task.mapper';
import { LoggerService } from '../logger.service';

@Injectable()
export class TaskServiceImpl implements TaskService {
  constructor(
    @Inject(Task_Repository)
    private readonly repository: TaskRepository,
    @Inject(User_Service)
    private readonly userService: UserService,
    @Inject(Task_Mapper)
    private readonly taskMapper: TaskMapper,
    @Inject(Logger_Service)
    private readonly logger: LoggerService,
  ) {}

  public async create(dto: CreateTaskDto, userId: number) {
    const taskEntity = this.taskMapper.toEntity(dto);

    const user = await this.userService.getById(userId);
    taskEntity.user = Promise.resolve(user);

    const savedTask = await this.save(taskEntity);

    return this.taskMapper.toDto(savedTask);
  }

  public async update(dto: UpdateTaskDto, taskId: number) {
    await this.repository.update(taskId, dto);

    const updatedTask = await this.getById(taskId);

    return this.taskMapper.toDto(updatedTask);
  }

  public async delete(id: number) {
    const taskEntity = await this.getById(id);

    await this.repository.delete(taskEntity);
  }

  public async getAll(email: string, userId: number) {
    if (!(await this.userService.isExists(email))) {
      throw new NotFoundException('User not found');
    }

    const taskList = await this.repository.findAll(userId);

    return taskList.map((task) => this.taskMapper.toDto(task));
  }

  public async getById(id: number) {
    const taskEntity = await this.repository.findById(id);

    if (!taskEntity) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return taskEntity;
  }

  public async save(entity: Task) {
    const savedTask = await this.repository.save(entity);
    this.logger.info(`Task with ID ${savedTask.id} saved successfully.`);

    return savedTask;
  }

  public async isExists(id: number) {
    return await this.repository.isExists(id);
  }

  public async isOwner(userId: number, resourceId: number) {
    const task = await this.getById(resourceId);

    const user = await task.user;

    if (userId !== user.id) {
      throw new ForbiddenException("You don't have enough permissions for this action");
    }

    return true;
  }
}
