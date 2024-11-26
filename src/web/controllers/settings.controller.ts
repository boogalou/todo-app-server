import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsDto } from '../dto/settings/settings.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { getUserSettingsDocs, updateSettingsDocs } from '../docs/swagger-docs';
import { ApiDocs } from '../../shared/api-docs';
import { SettingsService } from '../../application/services/settings.service';
import { Settings_Service } from '../../shared/tokens';

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
  async getByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const settings = await this.settingsService.getByUserId(userId);
    return settings;
  }

  @Put()
  @ApiDocs(updateSettingsDocs)
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ValidationPipe()) dto: SettingsDto,
  ) {
    return await this.settingsService.save(dto);
  }
}
