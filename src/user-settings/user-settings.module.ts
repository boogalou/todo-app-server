import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettingsEntity } from './entity/user-settings.entity';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsRepository } from './user-settings.repository';
import { UserSettingsService } from './user-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettingsEntity])],
  providers: [UserSettingsService, UserSettingsRepository],
  controllers: [UserSettingsController],
  exports: [UserSettingsService, UserSettingsRepository],
})
export class UserSettingsModule {}
