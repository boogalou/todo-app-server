import { Expose } from 'class-transformer';

export class TaskResponseDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly title: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly color: string;

  @Expose()
  readonly category: string;

  @Expose()
  readonly dueDate: string;

  @Expose()
  readonly isCompleted: boolean;

  @Expose()
  readonly createdAt: string;

  @Expose()
  readonly updatedAt: string;
}
