import { SettingsDto } from '../../dto/settings/settings.dto';
import { Settings } from '../../../domain/entities/settings.entity';

export interface SettingsMapper {
  toEntity(dto: SettingsDto): Settings;

  mergeUpdate(dto: SettingsDto, entity: Settings): Settings;

  toDto(entity: Settings): SettingsDto;
}
