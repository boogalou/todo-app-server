import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskDto } from './dto/Task.dto';
import { TaskEntity } from './entity/Task.entity';
import { TaskRepository } from './task.repository';
import { UpdateTaskParams } from './types/taskService.types';
import { TaskResponseDto } from './dto/TaskResponse.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class TaskService {
  constructor(
    private readonly tasksRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(taskDto: TaskDto, userId: number, ownerId: number) {
    if (userId !== ownerId) {
      throw new ForbiddenException('Access denied. You do not have enough permissions.');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} was not found.`);
    }

    const newTask = this.tasksRepository.createEntity(taskDto);
    newTask.user = user;
    const savedTask = await this.tasksRepository.save(newTask);

    return this.toDto(savedTask);
  }

  async findAll(userId: number, ownerId: number) {
    if (userId !== ownerId) {
      throw new ForbiddenException('Access denied. You do not have enough permissions.');
    }

    const tasks = await this.tasksRepository.findAll(userId);

    return tasks.map((task) => this.toDto(task));
  }

  async delete(taskId: number, userId: number, ownerId: number) {
    if (userId !== ownerId) {
      throw new ForbiddenException('Access denied. You do not have enough permissions.');
    }

    const isOwner = await this.tasksRepository.isOwner(taskId, userId);

    if (!isOwner) {
      throw new ForbiddenException(
        'Access denied. You do not have enough permission to delete this task.',
      );
    }

    const task = await this.tasksRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} was not found.`);
    }

    return await this.tasksRepository.remove(task);
  }

  async update({ taskDto, taskId, userId, ownerId }: UpdateTaskParams) {
    if (userId !== ownerId) {
      throw new ForbiddenException('Access denied. You do not have enough permissions.');
    }

    const isOwner = await this.tasksRepository.isOwner(taskId, userId);

    if (!isOwner) {
      throw new ForbiddenException(
        'Access denied. You do not have enough permission to edit this task.',
      );
    }

    const task = await this.tasksRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} was not found.`);
    }

    const updatedTask = this.tasksRepository.mergeToEntity(task, taskDto);

    const savedTask = await this.tasksRepository.save(updatedTask);
    return this.toDto(savedTask);
  }

  private toDto(taskEntity: TaskEntity): Partial<TaskResponseDto> {
    const dto: Partial<TaskResponseDto> = {};

    const keys = [
      'id',
      'title',
      'description',
      'category',
      'color',
      'dueDate',
      'isCompleted',
      'createdAt',
      'updatedAt',
    ];

    keys.forEach((key) => {
      if (taskEntity[key] !== undefined) {
        dto[key] =
          taskEntity[key] instanceof Date ? taskEntity[key].toISOString() : taskEntity[key];
      }
    });

    return dto;
  }
}
