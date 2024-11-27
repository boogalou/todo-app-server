import { Settings } from '../../domain/entities/settings.entity';
import { SettingsDto } from '../dto/settings/settings.dto';

export interface SettingsService {
  getById(id: number): Promise<Settings>;

  getByUserId(id: number): Promise<Settings>;

  save(dto: SettingsDto): Promise<Settings>;

  update(entity: SettingsDto): Promise<SettingsDto>;

  isOwner(userId: number, resourceId: number): Promise<boolean>;
}
