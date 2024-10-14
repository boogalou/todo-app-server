export class TaskResponseDto {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly color: string;
  readonly category: string;
  readonly dueDate: string;
  readonly isCompleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
