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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDetails } from '../../shared/types';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { createTaskDocs, deleteTaskDocs, getTasksDocs, updateTaskDocs } from '../docs/task.docs';
import { ApiDocs } from '../../shared/api-docs';
import { UpdateTaskDto } from '../../application/dto/task/update-task.dto';
import { CreateTaskDto } from '../../application/dto/task/create-task.dto';
import { UserAuth } from '../security/decorators/user-details.decorator';
import { Logger_Service, Task_Service } from '../../shared/tokens';
import { TaskService } from '../../application/services/task.service';
import { LoggerService } from '../../application/services/logger.service';
import { ResourceOwnership } from '../security/guards/resource-ownership.guard';

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
  async createTask(@UserAuth() user: UserDetails, @Body(ValidationPipe) dto: CreateTaskDto) {
    return await this.taskService.create(dto, user.id);
  }

  @Patch('/:id')
  @UseGuards(ResourceOwnership)
  @HttpCode(HttpStatus.OK)
  @ApiDocs(updateTaskDocs)
  async updateTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body(ValidationPipe) dto: UpdateTaskDto,
  ) {
    return await this.taskService.update(dto, taskId);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocs(deleteTaskDocs)
  async deleteTask(@UserAuth() user: UserDetails, @Param('taskId', ParseIntPipe) taskId: number) {
    await this.taskService.delete(taskId, user.id);
  }
}
