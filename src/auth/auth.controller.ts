import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/CreateUser.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/LoginUser.dto';
import { Cookies } from '../middleware/Cookies.middleware';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async register(
    @Body('user') createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const generateRefreshToken = true;
    const user = await this.userService.create(createUserDto);
    const authResponse = await this.userService.userBuilder(user, generateRefreshToken);
    this.setCookies(res, authResponse.refreshToken);
    delete authResponse.refreshToken;
    res.status(HttpStatus.CREATED).send(authResponse);
  }

  @Post('login')
  async login(
    @Body('user')
    loginUserDto: LoginUserDto,
    @Res() res: Response,
  ) {
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

  @Post('refresh')
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
