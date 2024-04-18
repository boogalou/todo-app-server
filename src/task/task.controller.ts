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
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, TaskDto } from './dto/CreateTask.dto';
import { TaskService } from './task.service';
import { EditTaskDto } from './dto/EditTask.dto';
import { TaskResponseDto } from './dto/TaskResponse.dto';
import { TaskStatusResponseDto } from './dto/TaskStatusResponse.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiBody({ type: CreateTaskDto, description: 'Add a new task' })
  @ApiResponse({ description: '', type: TaskResponseDto })
  async addNewTask(@Body('task') task: TaskDto, @Req() req: Request, @Res() res: Response) {
    const newTask = await this.taskService.create(task, req);
    res.status(HttpStatus.OK).send(newTask);
  }

  @Get(':id/details')
  @ApiParam({
    description: 'Task ID',
    name: 'id',
    type: 'string',
  })
  async getOneTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const task = await this.taskService.getOne(taskId, req);
    res.status(HttpStatus.OK).send(task);
  }

  @Get(':id/tasks')
  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: 'string',
  })
  async getAllTasks(
    @Param('id', ParseIntPipe) userId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userTasks = await this.taskService.getAll(userId, req);
    res.status(HttpStatus.OK).send(userTasks);
  }

  @Patch(':id/edit')
  @ApiBody({ description: 'Task data', type: EditTaskDto })
  @ApiResponse({ type: EditTaskDto })
  async editTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body('taskData') taskData: EditTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const updatedTask = await this.taskService.update(taskData, taskId, req);
    res.status(HttpStatus.OK).send(updatedTask);
  }

  @Delete(':id/delete')
  @ApiParam({
    description: 'Task ID',
    name: 'id',
    type: 'string',
  })
  async deleteTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.taskService.delete(taskId, req);
    res.status(HttpStatus.NO_CONTENT).send({
      message: `The task with id${taskId} was successful deleted`,
    });
  }

  @Patch(':id/completed')
  @ApiParam({
    description: 'Task ID',
    name: 'id',
    type: 'string',
  })
  @ApiQuery({
    description: 'Task status completed',
    name: 'completed',
    type: 'boolean',
  })
  @ApiResponse({ type: TaskStatusResponseDto })
  async changeTaskStatus(
    @Param('id', ParseIntPipe) taskId: number,
    @Query('completed') completed: boolean,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const newStatus = await this.taskService.updateTaskStatus(taskId, completed, req);
    res.status(HttpStatus.OK).send(newStatus);
  }
}
