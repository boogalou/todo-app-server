import { Settings } from '../../domain/entities/settings.entity';
import { SettingsDto } from '../dto/settings/settings.dto';

export interface SettingsService {
  save(entity: Settings): Promise<Settings>;

  getById(id: number): Promise<Settings>;

  getByUserId(id: number): Promise<SettingsDto>;

  update(userId: number, entity: SettingsDto): Promise<SettingsDto>;

  isExists(id: number): Promise<boolean>;
}
