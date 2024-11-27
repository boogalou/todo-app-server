import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Task_Mapper, Task_Repository, User_Service } from '../../../shared/tokens';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { TaskService } from '../task.service';
import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';
import { Task } from '../../../domain/entities/task.entity';
import { UserService } from '../user.service';
import { TaskMapper } from '../../mappers/task/task.mapper';

@Injectable()
export class TaskServiceImpl implements TaskService {
  constructor(
    @Inject(Task_Repository)
    private readonly tasksRepository: TaskRepository,
    @Inject(User_Service)
    private readonly userService: UserService,
    @Inject(Task_Mapper)
    private readonly taskMapper: TaskMapper,
  ) {}

  public async create(dto: CreateTaskDto, userId: number) {
    const taskEntity = this.taskMapper.toEntityFromCreate(dto);
    const user = await this.userService.getById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    taskEntity.user = user;
    const savedTask = await this.save(taskEntity);

    return this.taskMapper.toDto(savedTask);
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
