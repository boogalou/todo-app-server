import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskDto } from './dto/Task.dto';
import { TaskService } from './task.service';
import { ExtRequest } from '../shared/types';
import { AuthGuard } from '../guard/AuthGuard';
import { createTaskDocs, deleteTaskDocs, getTasksDocs, updateTaskDocs } from './docs/swagger-docs';
import { ApiDocs } from '../shared/api-docs';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('users/:userId/tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiDocs(getTasksDocs)
  async getTasks(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const ownerId = req.user.id;
    const tasks = await this.taskService.findAll(userId, ownerId);
    res.status(HttpStatus.OK).send(tasks);
  }

  @Post()
  @ApiDocs(createTaskDocs)
  async createTask(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ValidationPipe({ groups: ['create'] })) taskDto: TaskDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const ownerId = req.user.id;
    const newTask = await this.taskService.create(taskDto, userId, ownerId);
    res.status(HttpStatus.OK).send(newTask);
  }

  @Patch(':taskId')
  @ApiDocs(updateTaskDocs)
  async updateTask(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body(
      new ValidationPipe({
        groups: ['update'],
        skipMissingProperties: true,
        whitelist: true,
      }),
    )
    taskDto: TaskDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const ownerId = req.user.id;
    const updatedTask = await this.taskService.update({ taskDto, taskId, userId, ownerId });
    res.status(HttpStatus.OK).send(updatedTask);
  }

  @Delete(':taskId')
  @ApiDocs(deleteTaskDocs)
  async deleteTask(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const ownerId = req.user.id;
    await this.taskService.delete(taskId, userId, ownerId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
