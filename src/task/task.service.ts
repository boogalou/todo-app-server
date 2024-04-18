import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TaskDto } from './dto/CreateTask.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entity/Task.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '../jwt/jwt.service';
import { EditTaskDto } from './dto/EditTask.dto';
import { TaskStatusResponseDto } from './dto/TaskStatusResponse.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async create(task: TaskDto, req: Request) {
    const userId = this.jwtService.getUserIdFromToken(req);

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newTask = new TaskEntity();
    Object.assign(newTask, task);
    newTask.user = user;

    try {
      const savedTask = await this.tasksRepository.save(newTask);

      return this.modifyTask(savedTask);
    } catch (err) {
      throw new InternalServerErrorException('Database response error');
    }
  }

  async getOne(taskId: number, req: Request) {
    const userId = this.jwtService.getUserIdFromToken(req);

    const task = await this.findTaskByUser(taskId, userId);

    if (!task) {
      throw new UnauthorizedException('Resource is not accessible. Unauthorized access');
    }

    return this.modifyTask(task);
  }

  async getAll(userId: number, req: Request) {
    const user_Id = this.jwtService.getUserIdFromToken(req);

    if (userId !== user_Id) {
      throw new UnauthorizedException();
    }

    return await this.tasksRepository.find({
      where: { userId: user_Id },
    });
  }

  async delete(taskId: number, req: Request) {
    const userId = this.jwtService.getUserIdFromToken(req);
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const task = await this.tasksRepository.findOne({
      where: { id: taskId, userId: userId },
    });

    if (!task) {
      throw new NotFoundException(`The task with id:${taskId} was not found`);
    }

    try {
      this.logger.log(`The UserId: ${userId} successful deleted the taskID:${taskId}`);
      return await this.tasksRepository.remove(task);
    } catch (err) {
      this.logger.error(
        `Delete task is failed. Database response error. Request \`from\` userID${user} for deleted task${taskId}`,
      );
      throw new InternalServerErrorException('Delete task is failed. Database response error');
    }
  }

  async update(taskData: EditTaskDto, taskId: number, req: Request) {
    const userId = this.jwtService.getUserIdFromToken(req);

    const task = await this.findTaskByUser(taskId, userId);
    if (!task) {
      throw new UnauthorizedException('Resource is not accessible. Unauthorized access');
    }

    Object.assign(task, taskData);

    const updatedTask = await this.tasksRepository.save(task);
    return this.modifyTask(updatedTask);
  }

  async updateTaskStatus(taskId: number, completed: boolean, req: Request) {
    const userId = this.jwtService.getUserIdFromToken(req);

    const task = await this.findTaskByUser(taskId, userId);

    if (!task) {
      throw new UnauthorizedException('Resource is not accessible. Unauthorized access');
    }

    task.isCompleted = completed;

    try {
      const newTask = await this.tasksRepository.save(task);
      return { completed: newTask.isCompleted } as TaskStatusResponseDto;
    } catch (err) {
      throw new InternalServerErrorException('Database response error');
    }
  }

  async findById(taskId: number) {
    try {
      return await this.tasksRepository.findOne({ where: { id: taskId } });
    } catch (err) {
      throw new InternalServerErrorException('Database response error');
    }
  }

  async findTaskByUser(taskId: number, userId: number) {
    try {
      return await this.tasksRepository.findOne({
        where: { id: taskId, userId: userId },
      });
    } catch (err) {
      throw new InternalServerErrorException('Database response error');
    }
  }

  modifyTask(task: TaskEntity) {
    delete task.userId;
    delete task.user;
    return task;
  }
}
