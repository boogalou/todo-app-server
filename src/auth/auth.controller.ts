import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, ILoginUserDto, LoginUserDto, UserDto } from './dto/AuthUser.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Cookies } from '../middleware/Cookies.middleware';
import { AuthResponseDto } from './dto/AuthResponse.dto';

@ApiTags('auth')
@UsePipes(new ValidationPipe())
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @ApiBody({
    type: CreateUserDto,
    description: 'Registration of a new user',
  })
  @ApiResponse({
    type: AuthResponseDto,
    description: 'Successful user creation',
  })
  async register(@Body('user') createUserDto: UserDto, @Res() res: Response) {
    const generateRefreshToken = true;
    const user = await this.userService.create(createUserDto);
    const authResponse = await this.userService.userBuilder(user, generateRefreshToken);
    this.setCookies(res, authResponse.refreshToken);
    delete authResponse.refreshToken;
    res
      .status(HttpStatus.CREATED)
      .send(authResponse)
      .send({ message: 'A new user was successfully created.' });
  }

  @Post('login')
  @ApiBody({
    description: 'Registration of a new user',
    type: LoginUserDto,
  })
  @ApiResponse({
    type: AuthResponseDto,
    description: 'Successful user creation',
  })
  async login(@Body('user') loginUserDto: ILoginUserDto, @Res() res: Response) {
    const generateRefreshToken = true;
    const user = await this.authService.login(loginUserDto);
    const authResponse = await this.userService.userBuilder(user, generateRefreshToken);
    this.setCookies(res, authResponse.refreshToken);
    delete authResponse.refreshToken;
    res.status(HttpStatus.OK).send(authResponse);
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.setHeader('Authorization', '');
    res.status(HttpStatus.OK).send({});
  }

  @Get('refresh')
  @ApiResponse({ type: AuthResponseDto })
  async refreshAccessToken(@Cookies('refreshToken') token: string, @Res() res: Response) {
    const user = await this.authService.refresh(token);
    const authResponse = await this.userService.userBuilder(user);
    res.status(HttpStatus.OK).send(authResponse);
  }

  private setCookies(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
