import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';
import { MatchPasswords } from '../../validations/decorators/match-password.decorator';

const passwordOptions = {
  minLength: 6,
  minUppercase: 1,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 255)
  username: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsStrongPassword(passwordOptions, { message: 'Password is not strong enough' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MatchPasswords('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
