import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly password: string;
}
