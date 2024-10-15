import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserSettingsRepository } from './user-settings.repository';
import { UserSettingsDto } from './dto/user-settings.dto';
import { UserEntity } from '../user/entity/User.entity';
import { UserSettingsEntity } from './entity/user-settings.entity';

@Injectable()
export class UserSettingsService {
  constructor(private readonly userSettingsRepository: UserSettingsRepository) {}

  async getByUserId(userId: number, ownerId: number) {
    if (userId !== ownerId) {
      throw new ForbiddenException(
        `Access denied. You don't have enough permissions to get these settings.`,
      );
    }
    return await this.userSettingsRepository.findByUserId(userId);
  }

  async update(settingsDto: UserSettingsDto, userId: number, ownerId: number) {
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

  async initializeDefaultSettings(user: UserEntity) {
    const defaultSettings: UserSettingsDto = { language: 'eng', theme: 'system' };
    const settings = this.userSettingsRepository.createEntity(defaultSettings);
    settings.user = user;
    return await this.userSettingsRepository.save(settings);
  }

  private toDto(settingsEntity: UserSettingsEntity): Partial<UserSettingsDto> {
    const dto: Partial<UserSettingsDto> = {};

    const keys = ['id', 'language', 'theme'];

    keys.forEach((key) => {
      if (settingsEntity[key] !== undefined) {
        dto[key] = settingsEntity[key];
      }
    });

    return dto;
  }
}
