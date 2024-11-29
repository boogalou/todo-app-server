import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Cookies } from '../security/decorators/cookies.decorator';
import { LoginUserDto } from '../../application/dto/auth/login-user.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { ApiDocs } from '../../shared/api-docs';
import { loginDocs, logoutDocs, refreshTokensDocs } from '../docs/auth.docs';
import { Auth_Service, Jwt_Service } from '../../shared/tokens';
import { AuthService } from '../../application/services/auth.service';
import { JwtService } from '../../application/services/jwt.service';
import { JwtToken } from '../../shared/types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(Auth_Service)
    private readonly authService: AuthService,
    @Inject(Jwt_Service)
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  @UsePipes(new ValidationPipe())
  @ApiDocs(loginDocs)
  public async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    const response = await this.authService.login(dto);
    const refreshToken = this.jwtService.createToken(
      response.id,
      response.email,
      JwtToken.REFRESH_TOKEN,
    );
    this.setCookies(res, refreshToken);

    res.status(HttpStatus.OK).send(response);
  }

  @Post('/refresh')
  @ApiBearerAuth()
  @ApiDocs(refreshTokensDocs)
  public async refreshAccessToken(@Cookies('refresh_token') token: string, @Res() res: Response) {
    const response = await this.authService.refresh(token);
    const refreshToken = this.jwtService.createToken(
      response.id,
      response.email,
      JwtToken.REFRESH_TOKEN,
    );
    this.setCookies(res, refreshToken);
    res.status(HttpStatus.OK).send(response);
  }

  @Post('/logout')
  @ApiBearerAuth()
  @ApiDocs(logoutDocs)
  @UseGuards(JwtAuthGuard)
  public async logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    res.setHeader('Authorization', '');
    res.status(HttpStatus.OK).send({});
  }

  private setCookies(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
