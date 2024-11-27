import { IsBoolean, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  readonly id: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly title?: string;

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

  @IsOptional()
  @IsISO8601()
  readonly dueDate?: string;

  @IsOptional()
  @IsBoolean()
  readonly isCompleted?: boolean;
}
