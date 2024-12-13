import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ExtRequest, UserDetails } from '../../shared/types';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { UserService } from '../../application/services/user.service';
import { UpdateUserDto } from '../../application/dto/user/update-user.dto';
import { CreateUserDto } from '../../application/dto/user/create-user.dto';
import { User_Service } from '../../shared/tokens';
import { UserAuth } from '../security/decorators/user-details.decorator';

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

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUser(@UserAuth() user: UserDetails) {
    return this.userService.getById(user.id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async update(@Body() dto: UpdateUserDto) {
    return this.userService.update(dto);
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
