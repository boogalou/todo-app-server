import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../../domain/entities/settings.entity';
import { SettingsRepository } from '../../domain/settings.repository';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class SettingsRepositoryImpl implements SettingsRepository {
  constructor(
    @InjectRepository(Settings)
    private readonly repository: Repository<Settings>,
    @Inject('LOGGER')
    private readonly logger: LoggerService,
  ) {}

  public async findByUserId(userId: number): Promise<Settings | null> {
    try {
      return await this.repository.findOne({ where: { user: { id: userId } } });
    } catch (err) {
      this.logger.error(
        `Error occurred while retrieving settings for user with ID ${userId}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to retrieve settings for user with ID ${userId}. Please try again later.`,
      );
    }
  }

  public async findById(id: number): Promise<Settings | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (err) {
      this.logger.error(
        `Error occurred while retrieving settings with ID ${id}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to retrieve settings with ID ${id}. Please try again later.`,
      );
    }
  }

  public async save(entity: Settings): Promise<Settings> {
    try {
      return await this.repository.save(entity);
    } catch (err) {
      this.logger.error(
        `Error occurred while saving settings. Settings details: ${JSON.stringify(entity)}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to save settings. Please check the provided data and try again.`,
      );
    }
  }
}
