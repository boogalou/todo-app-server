import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDataDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MaxLength(60, { message: 'Password must not exceed 60 characters' })
  readonly password: string;
}

export class LoginUserDto {
  @ApiProperty({ type: () => LoginDataDto })
  user: LoginDataDto;
}
