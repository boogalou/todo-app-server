import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../../domain/entities/settings.entity';
import { SettingsController } from '../../web/controllers/settings.controller';
import { SettingsServiceImpl } from '../../application/services/impl/settings.service.impl';
import { Settings_Repository, Settings_Service } from '../../shared/tokens';
import { SettingsRepositoryImpl } from '../repositories/settings.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers: [
    {
      provide: Settings_Service,
      useClass: SettingsServiceImpl,
    },
    {
      provide: Settings_Repository,
      useClass: SettingsRepositoryImpl,
    },
  ],
  controllers: [SettingsController],
  exports: [SettingsServiceImpl],
})
export class SettingsModule {}
