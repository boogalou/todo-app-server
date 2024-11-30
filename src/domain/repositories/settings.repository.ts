import { Settings } from '../entities/settings.entity';
import { SettingsDto } from '../../application/dto/settings/settings.dto';
import { UpdateResult } from 'typeorm';

export interface SettingsRepository {
  findById(id: number): Promise<Settings | null>;

  findByUserId(userId: number): Promise<Settings | null>;

  isExists(id: number): Promise<boolean>;

  update(id: number, dto: SettingsDto): Promise<UpdateResult>;
}
