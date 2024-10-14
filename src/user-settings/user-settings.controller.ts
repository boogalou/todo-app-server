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
} from '@nestjs/common';
import { ExtRequest } from '../shared/types';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserSettingsDto } from './dto/user-settings.dto';
import { UserSettingsService } from './user-settings.service';
import { AuthGuard } from '../guard/AuthGuard';
import { getUserSettingsDocs } from './docs/swagger-docs';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('users/:userId/settings')
@UseGuards(AuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @ApiOperation(getUserSettingsDocs.operation)
  @ApiParam(getUserSettingsDocs.param)
  @ApiResponse(getUserSettingsDocs.response200)
  @ApiResponse(getUserSettingsDocs.response404)
  @Get()
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const settings = await this.userSettingsService.getById(userId, req);
    res.status(HttpStatus.OK).send(settings);
  }

  @ApiParam({
    description: 'User ID',
    name: 'userId',
    type: 'number',
  })
  @ApiBody({
    description: `Edit a user's settings`,
    type: UserSettingsDto,
  })
  @ApiResponse({
    description: '',
  })
  @Put()
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() settingsDto: UserSettingsDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const settings = await this.userSettingsService.update(userId, settingsDto, req);

    res.status(HttpStatus.OK).send(settings);
  }
}
