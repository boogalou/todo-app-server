import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type Lang = 'eng' | 'rus';
type Theme = 'system' | 'light' | 'dark';

export class UserSettingsDto {
  @ApiProperty()
  @IsNotEmpty({ groups: ['update'] })
  id?: number;

  @ApiProperty()
  @IsNotEmpty({ groups: ['create', 'update'] })
  @IsIn(['eng', 'rus'], { groups: ['create', 'update'] })
  language: Lang;

  @ApiProperty()
  @IsNotEmpty({ groups: ['create', 'update'] })
  @IsIn(['system', 'light', 'dark'], { groups: ['create', 'update'] })
  theme: Theme;
}
