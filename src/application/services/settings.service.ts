import { Settings } from '../../domain/entities/settings.entity';
import { SettingsDto } from '../dto/settings/settings.dto';

export interface SettingsService {
  getById(id: number): Promise<Settings>;

  getByUserId(id: number): Promise<Settings>;

  update(userId: number, entity: SettingsDto): Promise<SettingsDto>;

  isExists(id: number): Promise<boolean>;

  isOwner(userId: number, resourceId: number): Promise<boolean>;
}
