import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

type Lang = 'eng' | 'rus';
type Theme = 'system' | 'light' | 'dark';

export class UserSettingsDto {
  @IsOptional()
  @IsNotEmpty({ groups: ['update'] })
  id?: number;

  @IsOptional()
  @IsNotEmpty({ groups: ['create', 'update'] })
  @IsIn(['eng', 'rus'], { groups: ['create', 'update'] })
  language?: Lang;

  @IsOptional()
  @IsNotEmpty({ groups: ['create', 'update'] })
  @IsIn(['system', 'light', 'dark'], { groups: ['create', 'update'] })
  theme?: Theme;
}
