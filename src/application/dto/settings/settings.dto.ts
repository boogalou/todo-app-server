import { IsNotEmpty } from 'class-validator';
import { Lang } from '../../../domain/enums/lang.enum';
import { Theme } from '../../../domain/enums/theme.enum';

export class SettingsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  language?: Lang;

  @IsNotEmpty()
  theme?: Theme;
}
