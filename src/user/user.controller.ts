import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDataDto, ProfileDto } from './dto/Profile.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/:id/edit')
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
  async editUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body('profileData') profileData: ProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const editedUser = await this.userService.update(userId, profileData, req);
    res.status(HttpStatus.OK).send(editedUser);
  }

  @Delete('/:id/delete')
  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: 'string',
  })
  async deleteAccount(
    @Param('id', ParseIntPipe) userId: number,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    await this.userService.delete(userId, req);
    res.status(HttpStatus.NO_CONTENT).send('Account was successfully deleted');
  }

  @Patch('/:id/avatar')
  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: 'string',
  })
  async setAvatar() {}
}
