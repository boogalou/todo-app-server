import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  isCompleted: boolean;
}
