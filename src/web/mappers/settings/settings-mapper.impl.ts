import { SettingsMapper } from './settings-mapper.';
import { SettingsDto } from '../../dto/settings/settings.dto';
import { Settings } from '../../../domain/entities/settings.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class SettingsMapperImpl implements SettingsMapper {
  toEntity(dto: SettingsDto): Settings {
    return plainToInstance(Settings, dto);
  }

  toDto(entity: Settings): SettingsDto {
    return plainToInstance(SettingsDto, instanceToPlain(entity));
  }
}
