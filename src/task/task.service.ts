import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { TaskEntity } from './entity/Task.entity';
import { EditTaskDto } from './dto/EditTask.dto';
import { ExtRequest } from '../shared/types';
import { TaskRepository } from './task.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class TaskService {
  constructor(
    private readonly tasksRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createTask(task: CreateTaskDto, req: ExtRequest) {
    const userId = req.user.id;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const newTask = new TaskEntity();
    Object.assign(newTask, task);
    newTask.user = user;

    const savedTask = await this.tasksRepository.save(newTask);
    delete savedTask.user;
    return savedTask;
  }

  async getTasks(req: ExtRequest) {
    const userId = req.user.id;

    if (!userId) {
      throw new ForbiddenException('Resource is not accessible. Unauthorized access');
    }

    console.log('get tasks: ', userId);
    return await this.tasksRepository.findAll(userId);
  }

  async deleteTask(taskId: number, req: ExtRequest) {
    const userId = req.user.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const task = await this.tasksRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException(`The task with id:${taskId} was not found`);
    }

    if (task.user.id !== userId) {
      throw new UnauthorizedException('You do not have permission to delete this task');
    }

    return await this.tasksRepository.remove(task);
  }

  async updateTask(taskData: EditTaskDto, taskId: number, req: ExtRequest) {
    const userId = req.user.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    if (taskData.id !== taskId) {
      throw new ForbiddenException('You do not have permission to edit this task');
    }

    await this.tasksRepository.update(taskData.id, taskData);
    const updatedTask = await this.tasksRepository.findById(taskData.id);
    delete updatedTask.user;
    return updatedTask;
  }
}
