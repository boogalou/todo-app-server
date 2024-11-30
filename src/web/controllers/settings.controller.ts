import { Body, Controller, Get, Inject, Patch, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsDto } from '../../application/dto/settings/settings.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { getUserSettingsDocs, updateSettingsDocs } from '../docs/swagger-docs';
import { ApiDocs } from '../../shared/api-docs';
import { SettingsService } from '../../application/services/settings.service';
import { Settings_Service } from '../../shared/tokens';
import { UserAuth } from '../security/decorators/user-details.decorator';
import { UserDetails } from '../../shared/types';
import { ResourceOwnership } from '../security/guards/resource-ownership.guard';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(
    @Inject(Settings_Service)
    private readonly settingsService: SettingsService,
  ) {}

  @Get()
  @ApiDocs(getUserSettingsDocs)
  async getSettingsByUserId(@UserAuth() user: UserDetails) {
    return this.settingsService.getByUserId(user.id);
  }

  @Patch()
  @UseGuards(ResourceOwnership)
  @ApiDocs(updateSettingsDocs)
  async update(@UserAuth() user: UserDetails, @Body(new ValidationPipe()) dto: SettingsDto) {
    return this.settingsService.update(user.id, dto);
  }
}
