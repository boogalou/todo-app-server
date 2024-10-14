import { TaskDto } from '../dto/Task.dto';

export interface UpdateTaskParams {
  taskDto: TaskDto;
  taskId: number;
  userId: number;
  ownerId: number;
}
