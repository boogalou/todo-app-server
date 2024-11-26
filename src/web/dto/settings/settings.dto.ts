import { IsNotEmpty } from 'class-validator';

type Lang = 'eng' | 'rus';
type Theme = 'system' | 'light' | 'dark';

export class SettingsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  language?: Lang;

  @IsNotEmpty()
  theme?: Theme;
}
