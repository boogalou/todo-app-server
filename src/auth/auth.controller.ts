import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Cookies } from '../middleware/Cookies.middleware';
import { LoginDto } from './dto/Login.dto';
import { AuthGuard } from '../guard/AuthGuard';
import { RegistrationDto } from './dto/Registration.dto';
import { ApiDocs } from '../shared/api-docs';
import { loginDocs, logoutDocs, refreshTokensDocs, registrationDocs } from './docs/swagger-docs';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('registration')
  @ApiDocs(registrationDocs)
  @UsePipes(new ValidationPipe())
  async register(@Body() registrationDto: RegistrationDto, @Res() res: Response) {
    await this.userService.create(registrationDto);
    res.status(HttpStatus.CREATED).send();
  }

  @Post('login')
  @ApiDocs(loginDocs)
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(loginDto);
    const authResponse = this.userService.userBuilder(user);
    this.setCookies(res, authResponse.refreshToken);
    delete authResponse.refreshToken;
    res.status(HttpStatus.OK).send(authResponse);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiDocs(refreshTokensDocs)
  async refreshAccessToken(@Cookies('refreshToken') token: string, @Res() res: Response) {
    const user = await this.authService.refresh(token);
    const authResponse = this.userService.userBuilder(user);
    this.setCookies(res, authResponse.refreshToken);
    delete authResponse.refreshToken;
    res.status(HttpStatus.OK).send(authResponse);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiDocs(logoutDocs)
  @UseGuards(AuthGuard)
  async logout(@Req() @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.setHeader('Authorization', '');
    res.status(HttpStatus.OK).send({});
  }

  private setCookies(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
