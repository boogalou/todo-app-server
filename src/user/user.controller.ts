import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { EditProfileDto, ProfileDataDto } from './dto/EditProfile.dto';
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
  async editUser(
    @Param('id') userId: string,
    @Body('profileData') profileData: EditProfileDto,
    @Res() res: Response,
  ) {
    const editedUser = this.userService.update(Number(userId), profileData);
    res.status(HttpStatus.OK).send(editedUser);
  }

  @Delete('/:id/delete')
  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: 'string',
  })
  async deleteAccount(@Param('id') userId: string, @Res() res: Response) {
    await this.userService.delete(Number(userId));
    res.status(HttpStatus.OK).send({ message: 'User was successfully deleted' });
  }

  @Patch('/:id/avatar')
  @ApiParam({
    description: 'User ID',
    name: 'id',
    type: 'string',
  })
  async setAvatar() {}
}
