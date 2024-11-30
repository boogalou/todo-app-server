import { SettingsMapper } from './settings-mapper.';
import { Settings } from '../../../domain/entities/settings.entity';
import { plainToInstance } from 'class-transformer';
import { SettingsDto } from '../../dto/settings/settings.dto';

export class SettingsMapperImpl implements SettingsMapper {
  toDto(entity: Settings): SettingsDto {
    return plainToInstance(SettingsDto, entity, { excludeExtraneousValues: true });
  }

  toEntity(dto: SettingsDto): Settings {
    return plainToInstance(Settings, dto);
  }

  mergeUpdate(dto: SettingsDto, entity: Settings): Settings {
    const updatedFields = plainToInstance(Settings, dto, { excludeExtraneousValues: true });
    const result = Object.assign(entity, updatedFields);
    return result;
  }
}
