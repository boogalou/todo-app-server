import { Inject, Injectable } from '@nestjs/common';
import { SettingsService } from '../settings.service';
import { SettingsRepository } from '../../../domain/repositories/settings.repository';
import { Settings_Mapper, Settings_Repository } from '../../../shared/tokens';
import { SettingsDto } from '../../../web/dto/settings/settings.dto';
import { SettingsMapper } from '../../../web/mappers/settings/settings-mapper.';

@Injectable()
export class SettingsServiceImpl implements SettingsService {
  constructor(
    @Inject(Settings_Repository)
    private readonly repository: SettingsRepository,
    @Inject(Settings_Mapper)
    private readonly settingsMapper: SettingsMapper,
  ) {}

  public async getById(id: number) {
    return await this.repository.findById(id);
  }

  public async getByUserId(userId: number) {
    return await this.repository.findByUserId(userId);
  }

  public async save(dto: SettingsDto) {
    const entity = this.settingsMapper.toEntity(dto);
    return await this.repository.save(entity);
  }

  public async update(dto: SettingsDto) {
    const updatedSettings = await this.save(dto);
    return this.settingsMapper.toDto(updatedSettings);
  }

  public async isOwner(userId: number, settingsId: number) {
    const settings = await this.getById(settingsId);

    return settings && userId === settings.user.id;
  }
}
