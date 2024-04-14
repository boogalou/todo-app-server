import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(4, 150)
  readonly username: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @IsString()
  @MaxLength(255)
  readonly email: string;
}
