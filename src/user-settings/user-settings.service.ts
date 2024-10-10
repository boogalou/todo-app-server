import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserSettingsRepository } from './user-settings.repository';
import { UserSettingsDto } from './dto/user-settings.dto';
import { UserEntity } from '../user/entity/User.entity';
import { ExtRequest } from '../shared/types';

@Injectable()
export class UserSettingsService {
  constructor(private readonly userSettingsRepository: UserSettingsRepository) {}

  async getById(userId: number, req: ExtRequest) {
    const ownerId = req.user.id;

    if (userId !== ownerId) {
      throw new ForbiddenException(
        `Access denied. You don't have enough permissions to get these settings.`,
      );
    }
    return await this.userSettingsRepository.findByUserId(userId);
  }

  async update(userId: number, settingsDto: UserSettingsDto, req: ExtRequest) {
    const isOwner = this.isOwner(userId, req.user.id);

    if (!isOwner) {
      throw new ForbiddenException(
        `Access denied. You don't have enough permissions to edit these settings.`,
      );
    }

    const userSettings = await this.userSettingsRepository.findByUserId(userId);
    const updatedSettings = { ...userSettings, ...settingsDto };
    return await this.userSettingsRepository.save(updatedSettings);
  }

  async initializeDefaultSettings(user: UserEntity) {
    const defaultSettings: UserSettingsDto = { language: 'eng', theme: 'system' };
    const settings = this.userSettingsRepository.create(defaultSettings);
    settings.user = user;
    return await this.userSettingsRepository.save(settings);
  }

  private isOwner(userId: number, ownerId: number) {
    return userId === ownerId;
  }
}
