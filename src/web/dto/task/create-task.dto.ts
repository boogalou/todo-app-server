export class CreateTaskDto {
  readonly title: string;
  readonly description: string;
  readonly color: string;
  readonly category: string;
  readonly dueDate: string;
  readonly isCompleted: boolean;
}
