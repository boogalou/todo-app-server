import { Body, Controller, Delete, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { EditProfileDto } from './dto/EditProfile.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('edit-profile')
  async editUser(@Body('user') editProfileDto: EditProfileDto, @Res() res: Response) {
    const editedUser = this.userService.update(editProfileDto);
    res.status(HttpStatus.OK).send(editedUser);
  }

  @Delete('delete-account')
  async deleteAccount(@Param('id') userId: string, @Res() res: Response) {
    await this.userService.delete(Number(userId));
    res.status(HttpStatus.OK).send({ message: 'User was successfully deleted' });
  }

  @Post('set-avatar')
  async setAvatar() {}
}
