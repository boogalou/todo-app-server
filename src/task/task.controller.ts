import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { TaskService } from './task.service';
import { EditTaskDto } from './dto/EditTask.dto';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('add')
  async addNewTask(@Body('task') task: CreateTaskDto, @Res() res: Response) {
    const newTask = await this.taskService.create(task);

    res.status(HttpStatus.OK).send(newTask);
  }

  @Patch('edit')
  async editTask(@Body('task') task: EditTaskDto) {}

  @Delete('delete/:task_id')
  async deleteTask() {}

  @Get('all/:user_id')
  async getTasks() {}

  @Get('one/:task_id')
  async getTask() {}

  @Patch('complete/:task_id')
  async changeTaskStatus() {}
}
