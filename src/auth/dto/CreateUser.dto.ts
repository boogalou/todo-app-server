import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordOptions = {
  minLength: 6,
  minUppercase: 1,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export class UserDataDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Username is required' })
  @Length(4, 150, { message: 'Username must be between 4 and 150 characters' })
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MaxLength(60, { message: 'Password must not exceed 60 characters' })
  @IsStrongPassword(passwordOptions, { message: 'Password is not strong enough' })
  password: string;
}

export class CreateUserDto {
  @ApiProperty({ type: () => UserDataDto })
  user: UserDataDto;
}
