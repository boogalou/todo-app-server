import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SettingsService } from '../settings.service';
import { SettingsRepository } from '../../../domain/repositories/settings.repository';
import { Settings_Mapper, Settings_Repository } from '../../../shared/tokens';
import { SettingsDto } from '../../dto/settings/settings.dto';
import { SettingsMapper } from '../../mappers/settings/settings-mapper.';

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
    const settings = await this.repository.findByUserId(userId);

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return settings;
  }

  public async update(userId: number, dto: SettingsDto) {
    if (!(await this.isExists(dto.id))) {
      throw new NotFoundException('Task not found');
    }

    await this.repository.update(userId, dto);

    const updatedSettings = await this.getById(dto.id);

    return this.settingsMapper.toDto(updatedSettings);
  }

  public async isExists(id: number) {
    return this.repository.isExists(id);
  }

  public async isOwner(userId: number, settingsId: number) {
    const settings = await this.getById(settingsId);

    return userId === settings.user.id;
  }
}
