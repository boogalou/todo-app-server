import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly description: string;

  @ApiProperty()
  @IsString()
  readonly color: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  readonly category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly isCompleted: boolean;
}

// export class CreateTaskDto {
//   @ApiProperty({ type: () => TaskDto })
//   @ValidateNested({ each: true })
//   task: () => TaskDto;
// }
