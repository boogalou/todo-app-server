import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TaskService } from '../../../application/services/task.service';
import { Settings_Service, Task_Service } from '../../../shared/tokens';
import { ExtRequest } from '../../../shared/types';
import { SettingsService } from '../../../application/services/settings.service';

@Injectable()
export class ResourceOwnership implements CanActivate {
  constructor(
    @Inject(Task_Service)
    private readonly taskService: TaskService,
    @Inject(Settings_Service)
    private readonly settingsService: SettingsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as ExtRequest;
    const userId = request.user.id;
    const resourceId = Number(request.params.id);

    if (request.url.includes('tasks')) {
      return await this.taskService.isOwner(userId, resourceId);
    }

    return false;
  }
}
