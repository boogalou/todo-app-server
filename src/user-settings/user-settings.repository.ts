import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettingsEntity } from './entity/user-settings.entity';
import { UserSettingsDto } from './dto/user-settings.dto';

@Injectable()
export class UserSettingsRepository {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly repository: Repository<UserSettingsEntity>,
  ) {}

  async findByUserId(userId: number) {
    return await this.repository.findOne({ where: { user: { id: userId } } });
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

  createEntity(settings: UserSettingsDto) {
    return this.repository.create(settings);
  }

  async isOwner(userId: number) {
    return await this.repository.exists({ where: { user: { id: userId } } });
  }
}
