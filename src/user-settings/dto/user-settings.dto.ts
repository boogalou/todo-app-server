import { IsIn, IsNotEmpty } from 'class-validator';

type Lang = 'eng' | 'rus';
type Theme = 'system' | 'light' | 'dark';

export class UserSettingsDto {
  @IsNotEmpty({ groups: ['update'] })
  id?: number;

  @IsNotEmpty({ groups: ['create', 'update'] })
  @IsIn(['eng', 'rus'], { groups: ['create', 'update'] })
  language: Lang;

  @IsNotEmpty({ groups: ['create', 'update'] })
  @IsIn(['system', 'light', 'dark'], { groups: ['create', 'update'] })
  theme: Theme;
}
