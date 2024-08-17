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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { TaskService } from './task.service';
import { EditTaskDto } from './dto/EditTask.dto';
import { TaskResponseDto } from './dto/TaskResponse.dto';
import { AuthGuard } from '../guard/AuthGuard';
import { ExtRequest } from '../shared/types';

@ApiTags('tasks')
@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieve a list of all tasks',
    type: TaskResponseDto,
    isArray: true,
  })
  async getTasks(@Req() req: Request, @Res() res: Response) {
    const tasks = await this.taskService.getTasks(req);
    res.status(HttpStatus.OK).send(tasks);
  }

  @Post()
  @ApiBody({
    description: 'Data required to create a new task',
    type: CreateTaskDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The newly created task',
    type: TaskResponseDto,
  })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const newTask = await this.taskService.createTask(createTaskDto, req);
    res.status(HttpStatus.OK).send(newTask);
  }

  @Patch(':id')
  @ApiParam({
    description: 'Unique identifier of the task to be updated',
    name: 'id',
    type: Number,
  })
  @ApiBody({
    description: 'Updated data for the task',
    type: EditTaskDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The updated task',
    type: TaskResponseDto,
  })
  async updateTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() taskData: EditTaskDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const updatedTask = await this.taskService.updateTask(taskData, taskId, req);
    console.log(updatedTask);
    res.status(HttpStatus.OK).send(updatedTask);
  }

  @Delete(':id')
  @ApiParam({
    description: 'Unique identifier of the task to be deleted',
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task successfully deleted',
  })
  async deleteTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    await this.taskService.deleteTask(taskId, req);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
