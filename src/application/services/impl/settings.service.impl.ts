import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SettingsRepositoryImpl } from '../../../infrastructure/repositories/settings.repository.impl';
import { SettingsDto } from '../../../web/dto/settings/settings.dto';
import { User } from '../../../domain/entities/user.entity';
import { Settings } from '../../../domain/entities/settings.entity';

@Injectable()
export class SettingsServiceImpl {
  constructor(private readonly userSettingsRepository: SettingsRepositoryImpl) {}

  async getByUserId(userId: number, ownerId: number) {
    if (userId !== ownerId) {
      throw new ForbiddenException(
        `Access denied. You don't have enough permissions to get these settings.`,
      );
    }
    return await this.userSettingsRepository.findByUserId(userId);
  }

  async update(settingsDto: SettingsDto, userId: number, ownerId: number) {
    if (userId !== ownerId) {
      throw new ForbiddenException(`Access denied. You don't have enough permissions`);
    }

    const settings = await this.userSettingsRepository.findByUserId(userId);

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    const updatedSettings = { ...settings, ...settingsDto };

    const savedSettings = await this.userSettingsRepository.save(updatedSettings);

    return this.toDto(savedSettings);
  }

  async initializeDefaultSettings(user: User) {
    const defaultSettings: SettingsDto = { language: 'eng', theme: 'system' };
    const settings = this.userSettingsRepository.createEntity(defaultSettings);
    settings.user = user;
    return await this.userSettingsRepository.save(settings);
  }

  private toDto(settingsEntity: Settings): Partial<SettingsDto> {
    const dto: Partial<SettingsDto> = {};

    const keys = ['id', 'language', 'theme'];

    keys.forEach((key) => {
      if (settingsEntity[key] !== undefined) {
        dto[key] = settingsEntity[key];
      }
    });

    return dto;
  }
}
