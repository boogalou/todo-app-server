import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordOptions = {
  minLength: 6,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  minUppercase: 1,
};

export class UserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Length(4, 150)
  readonly username?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @IsStrongPassword(passwordOptions)
  readonly password: string;
}

export class CreateUserDto {
  @ApiProperty({ type: () => UserDto })
  @ValidateNested({ each: true })
  user: Required<UserDto>;
}

export class LoginUserDto {
  @ApiProperty({ type: () => UserDto })
  @ValidateNested({ each: true })
  user: Omit<UserDto, 'username'>;
}

export type ILoginUserDto = Omit<UserDto, 'username'>;
