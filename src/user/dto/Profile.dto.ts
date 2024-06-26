import { IsEmail, IsOptional, IsString, Length, MaxLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
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

export class ProfileDataDto {
  @ApiProperty({ type: () => ProfileDto })
  @ValidateNested({ each: true })
  profileData: ProfileDto;
}
