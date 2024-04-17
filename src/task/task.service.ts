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
    const payload = this.jwtService.decodeToken(req);

    const user = await this.userService.findById(Number(payload.sub));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newTask = new TaskEntity();
    Object.assign(newTask, task);
    newTask.user = user;

    try {
      return await this.tasksRepository.save(newTask);
    } catch (err) {
      throw new InternalServerErrorException('Database response error');
    }
  }

  async getOne(taskId: number, req: Request) {
    const payload = this.jwtService.decodeToken(req);
    const userId = Number(payload.sub);

    return await this.findTaskByUser(taskId, userId);
  }

  async getAll(userId: number, req: Request) {
    const payload = this.jwtService.decodeToken(req);
    const user_Id = Number(payload.sub);

    if (userId !== user_Id) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.tasks;
  }

  async delete(taskId: number, req: Request) {
    const payload = this.jwtService.decodeToken(req);

    if (!payload) {
      throw new UnauthorizedException();
    }

    const userId = Number(payload.sub);
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const task = await this.tasksRepository.findOne({
      where: { id: taskId, user },
    });

    if (!task) {
      throw new NotFoundException(`The task with id${taskId} was not found`);
    }

    try {
      this.logger.log(`The UserId: ${userId} successful deleted the taskID: ${taskId}`);
      return await this.tasksRepository.remove(task);
    } catch (err) {
      this.logger.error(
        `Delete task is failed. Database response error. Request \`from\` userID${user} for deleted task${taskId}`,
      );
      throw new InternalServerErrorException('Delete task is failed. Database response error');
    }
  }

  async update(taskData: EditTaskDto, taskId: number, req: Request) {
    const payload = this.jwtService.decodeToken(req);
    const userId = Number(payload.sub);

    if (!userId) {
      throw new UnauthorizedException();
    }

    const task = await this.findTaskByUser(taskId, userId);

    Object.assign(task, taskData);

    return this.tasksRepository.save(task);
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
}
