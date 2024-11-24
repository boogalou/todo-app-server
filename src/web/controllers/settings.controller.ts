import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ExtRequest } from '../../shared/types';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsDto } from '../dto/settings/settings.dto';
import { SettingsServiceImpl } from '../../application/services/impl/settings.service.impl';
import { AuthGuard } from '../security/guards/auth.guard';
import { getUserSettingsDocs, updateSettingsDocs } from '../docs/swagger-docs';
import { ApiDocs } from '../../shared/api-docs';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('users/:userId/settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly userSettingsService: SettingsServiceImpl) {}

  @Get()
  @ApiDocs(getUserSettingsDocs)
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const ownerId = req.user.id;
    const settings = await this.userSettingsService.getByUserId(userId, ownerId);
    res.status(HttpStatus.OK).send(settings);
  }

  @Put()
  @ApiDocs(updateSettingsDocs)
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(
      new ValidationPipe({
        groups: ['update'],
        whitelist: true,
        skipMissingProperties: true,
      }),
    )
    settingsDto: SettingsDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const ownerId = req.user.id;
    const settings = await this.userSettingsService.update(settingsDto, userId, ownerId);

    res.status(HttpStatus.OK).send(settings);
  }
}
