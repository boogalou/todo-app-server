import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const iso8601DateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const UPDATE = { groups: ['update'] };
const CREATE_UPDATE = { groups: ['create', 'update'] };

export class TaskDto {
  @IsNotEmpty(UPDATE)
  @IsNumber({}, UPDATE)
  readonly id?: number;

  @IsOptional()
  @IsNotEmpty(CREATE_UPDATE)
  @IsString(CREATE_UPDATE)
  @MaxLength(255, CREATE_UPDATE)
  readonly title?: string;

  @IsOptional()
  @IsString(CREATE_UPDATE)
  @MaxLength(255, CREATE_UPDATE)
  readonly description?: string;

  @IsOptional()
  @IsString(CREATE_UPDATE)
  readonly color?: string;

  @IsOptional()
  @IsString(CREATE_UPDATE)
  @MaxLength(100, CREATE_UPDATE)
  readonly category?: string;

  @IsOptional()
  @IsNotEmpty(CREATE_UPDATE)
  @IsString(CREATE_UPDATE)
  @Matches(iso8601DateRegex, { message: 'dueDate must be in the format YYYY-MM-DDTHH:mm:ss.SSSZ' })
  readonly dueDate?: string;

  @IsOptional()
  @IsNotEmpty(CREATE_UPDATE)
  @IsBoolean(CREATE_UPDATE)
  readonly isCompleted?: boolean;
}
