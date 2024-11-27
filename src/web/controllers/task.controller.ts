import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import { ExtRequest, UserDetails } from '../../shared/types';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { createTaskDocs, deleteTaskDocs, getTasksDocs, updateTaskDocs } from '../docs/task.docs';
import { ApiDocs } from '../../shared/api-docs';
import { UpdateTaskDto } from '../../application/dto/task/update-task.dto';
import { CreateTaskDto } from '../../application/dto/task/create-task.dto';
import { UserAuth } from '../security/decorators/user-details.decorator';
import { Logger_Service, Task_Service } from '../../shared/tokens';
import { TaskService } from '../../application/services/task.service';
import { LoggerService } from '../../application/services/logger.service';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    @Inject(Task_Service)
    private readonly taskService: TaskService,
    @Inject(Logger_Service)
    private logger: LoggerService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiDocs(getTasksDocs)
  async getTasks(@UserAuth() user: UserDetails) {
    return await this.taskService.getAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiDocs(createTaskDocs)
  async createTask(@UserAuth() user: UserDetails, @Body(new ValidationPipe()) dto: CreateTaskDto) {
    this.logger.info(`Create Task:  ${JSON.stringify(dto, null, 2)}`);
    const newTask = await this.taskService.create(dto, user.id);
    this.logger.info(`Response Task:  ${JSON.stringify(newTask, null, 2)}`);

    return newTask;
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
    @UserAuth() user: UserDetails,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Res() res: Response,
  ) {
    await this.taskService.delete(taskId, user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
