import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettingsEntity } from './entity/user-settings.entity';
import { UserSettingsDto } from './dto/user-settings.dto';
import appDataSource from '../config/appDataSource.config';

@Injectable()
export class UserSettingsRepository {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly repository: Repository<UserSettingsEntity>,
  ) {}

  async findByUserId(userId: number) {
    try {
      return await appDataSource.manager
        .getRepository(UserSettingsEntity)
        .createQueryBuilder('settings')
        .select(['settings.id', 'settings.theme', 'settings.language'])
        .where('settings.user.id = :userId', { userId })
        .getOne();
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to find user settings by ID. Database error: ${err}`,
      );
    }
  }

  async findById(settingsId: number) {
    try {
      return await this.repository.findOne({ where: { id: settingsId } });
    } catch (err) {
      throw new InternalServerErrorException(`Failed find settings. Database error: ${err}`);
    }
  }

  async save(settings: UserSettingsEntity) {
    try {
      return await this.repository.save(settings);
    } catch (err) {
      throw new InternalServerErrorException(`Failed to save settings. Database error: ${err}`);
    }
  }

  create(settings: UserSettingsDto) {
    return this.repository.create(settings);
  }
}
