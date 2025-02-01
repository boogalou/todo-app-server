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
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { User_Mapper, User_Service } from '../../shared/tokens';
import { UserAuth } from '../security/decorators/user-details.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserMapper } from '../../application/mappers/user/user.mapper';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(
    @Inject(User_Service)
    private readonly userService: UserService,
    @Inject(User_Mapper)
    private readonly userMapper: UserMapper,
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
    const userEtity = await this.userService.getById(user.id);
    return this.userMapper.toDto(userEtity);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async update(@Body() dto: UpdateUserDto, @UserAuth() user: UserDetails) {
    return this.userService.update(dto, user.id);
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

  @Put('/:id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(@Param('id') userId: number, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatar(userId, file);
  }
}
