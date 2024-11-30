import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Settings } from '../../domain/entities/settings.entity';
import { SettingsRepository } from '../../domain/repositories/settings.repository';
import { LoggerService } from '../../application/services/logger.service';
import { Logger_Service } from '../../shared/tokens';
import { BaseRepository } from './base.repository';
import { SettingsDto } from '../../application/dto/settings/settings.dto';

@Injectable()
export class SettingsRepositoryImpl extends BaseRepository<Settings> implements SettingsRepository {
  constructor(
    @InjectRepository(Settings)
    protected readonly repository: Repository<Settings>,
    @Inject(Logger_Service)
    protected readonly logger: LoggerService,
  ) {
    super(repository);
  }

  public async findByUserId(userId: number): Promise<Settings | null> {
    return this.handler(
      () => this.repository.findOne({ where: { user: { id: userId } } }),
      'Error occurred while retrieving settings',
      userId,
    );
  }

  public async findById(id: number): Promise<Settings | null> {
    return this.handler(
      () => this.repository.findOne({ where: { id } }),
      'Error occurred while retrieving settings',
      id,
    );
  }

  public async update(id: number, dto: SettingsDto): Promise<UpdateResult> {
    return this.handler(
      () => this.repository.update(id, dto),
      'Error occurred while saving settings.',
      id,
    );
  }

  public async isExists(id: number): Promise<boolean> {
    return this.handler(
      () => this.repository.exists({ where: { id } }),
      'Error occurred while checking existence of task',
      id,
    );
  }
}
