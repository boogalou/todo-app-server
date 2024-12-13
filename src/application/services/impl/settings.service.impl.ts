import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SettingsService } from '../settings.service';
import { SettingsRepository } from '../../../domain/repositories/settings.repository';
import { Settings_Mapper, Settings_Repository } from '../../../shared/tokens';
import { SettingsDto } from '../../dto/settings/settings.dto';
import { SettingsMapper } from '../../mappers/settings/settings-mapper.';
import { Lang } from '../../../domain/enums/lang.enum';
import { Theme } from '../../../domain/enums/theme.enum';
import { User } from '../../../domain/entities/user.entity';
import { Settings } from '../../../domain/entities/settings.entity';

@Injectable()
export class SettingsServiceImpl implements SettingsService {
  constructor(
    @Inject(Settings_Repository)
    private readonly repository: SettingsRepository,
    @Inject(Settings_Mapper)
    private readonly settingsMapper: SettingsMapper,
  ) {}

  public async getById(id: number) {
    const settings = await this.repository.findById(id);

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return settings;
  }

  public async getByUserId(userId: number) {
    const settingsEntity = await this.repository.findByUserId(userId);
    if (settingsEntity) {
      return this.settingsMapper.toDto(settingsEntity);
    }

    const defaultSettings: SettingsDto = {
      language: Lang.ENGLISH,
      theme: Theme.SYSTEM,
    };

    return this.settingsMapper.toDto(this.settingsMapper.toEntity(defaultSettings));
  }

  public async update(userId: number, dto: SettingsDto) {
    const settingsEntity = await this.repository.findByUserId(userId);

    if (!settingsEntity) {
      const newSettingsEntity = this.settingsMapper.toEntity(dto);
      newSettingsEntity.user = { id: userId } as User;
      await this.repository.save(newSettingsEntity);
      return this.settingsMapper.toDto(newSettingsEntity);
    }

    const updatedSettings = this.settingsMapper.mergeUpdate(dto, settingsEntity);
    await this.repository.save(updatedSettings);
    return this.settingsMapper.toDto(updatedSettings);
  }

  public async save(entity: Settings) {
    return this.repository.save(entity);
  }

  public async isExists(id: number) {
    return this.repository.isExists(id);
  }
}
