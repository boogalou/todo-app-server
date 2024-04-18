import { ApiProperty } from '@nestjs/swagger';

export class TaskStatusResponseDto {
  @ApiProperty()
  completed: boolean;
}
