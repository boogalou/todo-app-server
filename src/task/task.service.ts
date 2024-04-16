import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/CreateTask.dto';

@Injectable()
export class TaskService {
  constructor() {}

  async create(task: CreateTaskDto) {}
}
