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
import { Task_Service } from '../../shared/tokens';
import { TaskService } from '../../application/services/task.service';
import { ResourceOwnership } from '../security/guards/resource-ownership.guard';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    @Inject(Task_Service)
    private readonly taskService: TaskService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiDocs(getTasksDocs)
  async getTasks(@UserAuth() user: UserDetails) {
    return this.taskService.getAll(user.email, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiDocs(createTaskDocs)
  async createTask(@UserAuth() user: UserDetails, @Body(ValidationPipe) dto: CreateTaskDto) {
    return this.taskService.create(dto, user.id);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ResourceOwnership)
  @ApiDocs(updateTaskDocs)
  async updateTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body(ValidationPipe) dto: UpdateTaskDto,
  ) {
    console.log('updateTask: ', dto);
    return this.taskService.update(taskId, dto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ResourceOwnership)
  @ApiDocs(deleteTaskDocs)
  async deleteTask(@Param('id', ParseIntPipe) taskId: number) {
    await this.taskService.delete(taskId);
  }
}
