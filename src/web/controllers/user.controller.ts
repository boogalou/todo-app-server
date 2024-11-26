import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ExtRequest } from '../../shared/types';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { UserService } from '../../application/services/user.service';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { User_Service } from '../../shared/tokens';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(
    @Inject(User_Service)
    private readonly userService: UserService,
  ) {}

  @Post('/registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
    return 'User was successfully created';
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async update(@Body() dto: UpdateUserDto) {
    const editedUser = await this.userService.update(dto);
    return editedUser;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(
    @Param('id', ParseIntPipe) userId: number,
    @Req() req: ExtRequest,
    @Res() res: Response,
  ) {
    await this.userService.delete(userId);
    res.status(HttpStatus.NO_CONTENT);
  }

  @Patch('/:id/avatar')
  async updateAvatar() {}
}
