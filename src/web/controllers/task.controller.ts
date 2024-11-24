import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { TaskServiceImpl } from '../../application/services/impl/task.service.impl';
import { ExtRequest, UserDetails } from '../../shared/types';
import { AuthGuard } from '../security/guards/auth.guard';
import { createTaskDocs, deleteTaskDocs, getTasksDocs, updateTaskDocs } from '../docs/task.docs';
import { ApiDocs } from '../../shared/api-docs';
import { UpdateTaskDto } from '../dto/task/update-task.dto';
import { CreateTaskDto } from '../dto/task/create-task.dto';
import { UserAuth } from '../security/decorators/user-details.decorator';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskServiceImpl) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiDocs(getTasksDocs)
  async getTasks(@UserAuth() user: UserDetails) {
    const ownerId = user.id;
    return await this.taskService.findAll(userId, ownerId);
  }

  @Post()
  @ApiDocs(createTaskDocs)
  async createTask(@Body(new ValidationPipe()) dto: CreateTaskDto, @Res() res: Response) {
    const newTask = await this.taskService.create(dto);
    res.status(HttpStatus.OK).send(newTask);
  }

  @Patch('/:id')
  @ApiDocs(updateTaskDocs)
  async updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body(new ValidationPipe()) dto: UpdateTaskDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const updatedTask = await this.taskService.update(dto);
    res.status(HttpStatus.OK).send(updatedTask);
  }

  @Delete('/:id')
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
