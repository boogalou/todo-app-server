import { Theme } from '../../../domain/enums/theme.enum';
import { Lang } from '../../../domain/enums/lang.enum';

export class DefaultSettingsDto {
  language: Lang;

  theme: Theme;
}
