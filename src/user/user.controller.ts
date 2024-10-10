import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDataDto, ProfileDto } from './dto/Profile.dto';
import { UserService } from './user.service';
import { ExtRequest } from '../shared/types';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { UserSettingsDto } from '../user-settings/dto/user-settings.dto';
import { AuthGuard } from '../guard/AuthGuard';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @Patch()
  @UsePipes(new ValidationPipe())
  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: 'string',
  })
  @ApiBody({
    description: `Edit a user's profile`,
    type: ProfileDataDto,
  })
  @ApiResponse({
    type: ProfileDto,
  })
  async edit(
    @Param('id', ParseIntPipe) userId: number,
    @Body('profileData') profileData: ProfileDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const editedUser = await this.userService.update(profileData, req);
    res.status(HttpStatus.OK).send(editedUser);
  }

  @Delete('/:id')
  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: Number,
  })
  async deleteAccount(
    @Param('id', ParseIntPipe) userId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    await this.userService.delete(userId, req);
    res.status(HttpStatus.NO_CONTENT);
  }

  @Patch('/:id/avatar')
  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: 'string',
  })
  async setAvatar() {}

  @Get('/:id/settings')
  async getSettingsByUserId(
    @Param('id', ParseIntPipe) userId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const settings = await this.userSettingsService.getById(userId, req);
    console.log(settings);
    res.status(HttpStatus.OK).send(settings);
  }

  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: 'number',
  })
  @ApiBody({
    description: `Edit a user's settings`,
    type: UserSettingsDto,
  })
  @Put('/:id/settings')
  async updateUserSettings(
    @Param('id', ParseIntPipe) userId: number,
    @Body() settingsDto: UserSettingsDto,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    const settings = await this.userSettingsService.update(userId, settingsDto, req);

    res.status(HttpStatus.OK).send(settings);
  }
}
