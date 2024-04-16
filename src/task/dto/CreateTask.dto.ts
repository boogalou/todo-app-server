import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsString()
  readonly label: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly category: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly dueDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  readonly isCompleted: boolean;
}
