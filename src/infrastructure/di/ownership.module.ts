import { Global, Module } from '@nestjs/common';
import TaskModule from './task.module';
import SettingsModule from './settings.module';
import { ResourceOwnership } from '../../web/security/guards/resource-ownership.guard';

@Global()
@Module({
  imports: [TaskModule, SettingsModule],
  providers: [ResourceOwnership],
  exports: [ResourceOwnership, TaskModule, SettingsModule],
})
export class OwnershipModule {}
