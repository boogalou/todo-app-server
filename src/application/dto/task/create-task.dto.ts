import { IsBoolean, IsISO8601, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;

  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsNotEmpty()
  @IsISO8601()
  readonly dueDate: string;

  @IsBoolean()
  readonly isCompleted: boolean;
}
