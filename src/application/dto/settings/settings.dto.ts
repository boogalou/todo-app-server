import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Lang } from '../../../domain/enums/lang.enum';
import { Theme } from '../../../domain/enums/theme.enum';
import { Expose } from 'class-transformer';

export class SettingsDto {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Lang)
  language?: Lang;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Theme)
  theme?: Theme;
}
