import { Settings } from '../entities/settings.entity';

export interface SettingsRepository {
  findById(id: number): Promise<Settings | null>;

  findByUserId(userId: number): Promise<Settings | null>;

  save(entity: Settings): Promise<Settings>;
}
