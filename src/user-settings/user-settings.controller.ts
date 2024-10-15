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
import { ExtRequest } from '../shared/types';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSettingsDto } from './dto/user-settings.dto';
import { UserSettingsService } from './user-settings.service';
import { AuthGuard } from '../guard/AuthGuard';
import { getUserSettingsDocs, updateSettingsDocs } from './docs/swagger-docs';
import { ApiDocs } from '../shared/api-docs';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('users/:userId/settings')
@UseGuards(AuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  @ApiDocs(getUserSettingsDocs)
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const settings = await this.userSettingsService.getById(userId, req);
    res.status(HttpStatus.OK).send(settings);
  }

  @Put()
  @ApiDocs(updateSettingsDocs)
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ValidationPipe({ groups: ['update'] })) settingsDto: UserSettingsDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const ownerId = req.user.id;
    const settings = await this.userSettingsService.update(settingsDto, userId, ownerId);

    res.status(HttpStatus.OK).send(settings);
  }
}
